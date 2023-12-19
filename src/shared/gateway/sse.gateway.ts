import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

interface SseEvent {
    data: string;
    type: string;
  }
  

@WebSocketGateway()
export class SseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private subscribers: any[] = [];

  @WebSocketServer()
  server: Server;

  handleSseConnection(req: any, res: any): void {
    // Set up SSE connection
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const subscriberCallback = (data: SseEvent) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const subscriber = interval(1000).pipe(
      map(() => ({ data: 'Event data' }))
    ).subscribe(subscriberCallback);

    this.subscribers.push(subscriber);

    subscriber.add(() => {
      const index = this.subscribers.indexOf(subscriber);
      if (index !== -1) {
        this.subscribers.splice(index, 1);
      }
    });
  }

  sendUpdateBalance(dynamicData: string): void {
    // Send dynamic data to all connected clients
    const eventData: SseEvent = { data: dynamicData, type: 'update-balance' };
    this.subscribers.forEach(subscriber => subscriber.next(eventData));
  }

  sendDriverFinish(dynamicData: string): void {
    // Send dynamic data to all connected clients
    const eventData: SseEvent = { data: dynamicData, type: 'driver-finish' };
    this.subscribers.forEach(subscriber => subscriber.next(eventData));
  }

  sendDriverOffer(dynamicData: string): void {
    // Send dynamic data to all connected clients
    const eventData: SseEvent = { data: dynamicData, type: 'driver-offer' };
    this.subscribers.forEach(subscriber => subscriber.next(eventData));
  }

  sendVerifiedTransction(dynamicData: string): void {
    // Send dynamic data to all connected clients
    const eventData: SseEvent = { data: dynamicData, type: 'transaction-verified' };
    this.subscribers.forEach(subscriber => subscriber.next(eventData));
  }

  handleConnection(client: any, ...args: any[]): any {
    // Handle new SSE connection
  }

  handleDisconnect(client: any): any {
    // Handle SSE disconnection
  }
}
