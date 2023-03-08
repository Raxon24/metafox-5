/**
 * @type: block
 * name: core.block.AdminNewsUpdate
 * title: AdminCP - News & Update
 * bundle: admincp
 * admincp: true
 */
import { createBlock } from '@metafox/framework';
import Base, { Props } from './Base';

export default createBlock<Props>({
  extendBlock: Base,
  overrides: {
    title: 'News & Updates'
  },
  defaults: {
    blockLayout: 'Admin - Contained'
  }
});
