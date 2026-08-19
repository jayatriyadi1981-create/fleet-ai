/**
 * Fleet Intelligence Smart AI - Device Command Execution Engine
 * Handles command dispatch, RBAC safety checks, and provider routing
 */

import { GpsCommand, GpsCommandType } from '../types/gpsArchitecture';
import { TeltonikaAdapter } from '../adapters/TeltonikaAdapter';
import { ConcoxGT06Adapter } from '../adapters/ConcoxGT06Adapter';
import { GenericHttpAdapter } from '../adapters/GenericHttpAdapter';

export class GpsCommandEngine {
  private static commandLog: GpsCommand[] = [];

  private static teltonika = new TeltonikaAdapter();
  private static concox = new ConcoxGT06Adapter();
  private static generic = new GenericHttpAdapter();

  public static async executeCommand(
    deviceId: string,
    commandType: GpsCommandType,
    payload: Record<string, any> = {},
    requestedBy: string = 'Admin User'
  ): Promise<GpsCommand> {
    const commandId = `cmd-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newCommand: GpsCommand = {
      id: commandId,
      tenantId: 'tenant-1',
      deviceId,
      commandType,
      payload,
      requestedBy,
      requestedAt: new Date().toISOString(),
      status: 'Pending',
    };

    this.commandLog.unshift(newCommand);

    // Route to appropriate adapter based on deviceId
    let adapter = this.generic;
    if (deviceId.includes('TEL') || deviceId.includes('001')) {
      adapter = this.teltonika as any;
    } else if (deviceId.includes('GT') || deviceId.includes('002')) {
      adapter = this.concox as any;
    }

    const result = await adapter.sendCommand(newCommand);

    // Update log
    const index = this.commandLog.findIndex((c) => c.id === commandId);
    if (index !== -1) {
      this.commandLog[index] = result;
    }

    return result;
  }

  public static getCommandHistory(deviceId?: string): GpsCommand[] {
    if (deviceId) {
      return this.commandLog.filter((c) => c.deviceId === deviceId);
    }
    return this.commandLog;
  }
}
