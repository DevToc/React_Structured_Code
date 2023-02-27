import delay from '../../../../utils/deplay';

/**
 * Delay 50 ms for simulating browser frame render request time
 * @returns
 */
export default function awaitNextFrame() {
  return delay(50);
}
