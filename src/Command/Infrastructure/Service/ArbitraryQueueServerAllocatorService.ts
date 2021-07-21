import QueueServerAllocatorService from "@app/Command/Domain/Service/QueueServerAllocatorService";
import ReservationQueue from "@app/Command/Domain/Service/ReservationQueue";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import NextActiveReservationNotFoundForQueueServer
  from "@app/Command/Domain/Error/NextActiveReservationNotFoundForQueueServer";

export default class ArbitraryQueueServerAllocatorService implements QueueServerAllocatorService {
  constructor(private readonly reservationQueue: ReservationQueue) {
  }

  public async getNextActiveReservation(queueServer: QueueServer): Promise<ActiveReservation> {
    let arbitraryNextReservation;
    for (const queueNodeId of queueServer.getAssignedQueueNodeIds()) {
      try {
        arbitraryNextReservation = await this.reservationQueue.getNextReservation(queueNodeId);
        break;
      } catch(e) {}
    }
    if (!arbitraryNextReservation)
      throw new NextActiveReservationNotFoundForQueueServer();
    return arbitraryNextReservation;
  }
}
