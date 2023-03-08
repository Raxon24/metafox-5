/**
 * @type: service
 * name: echoBackend
 */

import LaravelEcho from 'laravel-echo';
import 'pusher-js';
import { Manager } from '@metafox/framework/Manager';

class EchoBackend {
  public bootstrap(manager: Manager) {
    const KEY = manager?.setting?.broadcast?.connections?.pusher?.key;

    return new LaravelEcho({
      broadcaster: 'pusher',
      key: KEY,
      cluster: 'ap1',
      forceTLS: false
    });
  }
}
export default EchoBackend;
