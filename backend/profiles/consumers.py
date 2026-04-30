import json
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

# In-memory queue for simplicity in development. 
# In production, this should be in Redis.
waiting_users = []

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = str(uuid.uuid4())
        self.room_group_name = None
        await self.accept()
        
        # Add to waiting queue
        waiting_users.append({
            'channel_name': self.channel_name,
            'user_id': self.user_id
        })
        
        print(f"User {self.user_id} connected and queued. Queue size: {len(waiting_users)}")
        await self.try_match()

    async def disconnect(self, close_code):
        # Remove from waiting queue if still there
        global waiting_users
        waiting_users = [u for u in waiting_users if u['channel_name'] != self.channel_name]
        
        # Notify partner if in a room
        if self.room_group_name:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'partner_disconnected',
                }
            )
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        
        print(f"User {self.user_id} disconnected.")

    async def try_match(self):
        global waiting_users
        # Filter out self
        others = [u for u in waiting_users if u['channel_name'] != self.channel_name]
        
        if len(others) >= 1:
            # Match found!
            partner = others.pop(0)
            # Remove self from queue
            waiting_users = [u for u in waiting_users if u['channel_name'] != self.channel_name]
            # Remove partner from queue (redundant if others was a copy, but safe)
            waiting_users = [u for u in waiting_users if u['channel_name'] != partner['channel_name']]
            
            room_id = str(uuid.uuid4())
            self.room_group_name = f'chat_{room_id}'
            
            # Both join the group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.channel_layer.send(
                partner['channel_name'],
                {
                    'type': 'match_found',
                    'room_id': room_id,
                    'is_caller': False
                }
            )
            
            await self.send(text_data=json.dumps({
                'type': 'match_found',
                'roomId': room_id,
                'isCaller': True
            }))

    async def match_found(self, event):
        self.room_group_name = f'chat_{event["room_id"]}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.send(text_data=json.dumps({
            'type': 'match_found',
            'roomId': event["room_id"],
            'isCaller': event["is_caller"]
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get('type')

        if msg_type in ['offer', 'answer', 'ice_candidate']:
            if self.room_group_name:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'signal_message',
                        'message': data,
                        'sender_channel_name': self.channel_name
                    }
                )
        elif msg_type == 'find_next':
            await self.handle_find_next()
        elif msg_type == 'leave_room':
            await self.handle_leave_room()

    async def signal_message(self, event):
        # Don't send back to self
        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps(event['message']))

    async def partner_disconnected(self, event):
        self.room_group_name = None
        await self.send(text_data=json.dumps({
            'type': 'partner_disconnected'
        }))

    async def handle_find_next(self):
        # Leave current room
        if self.room_group_name:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'partner_disconnected',
                }
            )
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            self.room_group_name = None
        
        # Re-add to waiting queue
        waiting_users.append({
            'channel_name': self.channel_name,
            'user_id': self.user_id
        })
        await self.try_match()

    async def handle_leave_room(self):
        if self.room_group_name:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'partner_disconnected',
                }
            )
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            self.room_group_name = None
