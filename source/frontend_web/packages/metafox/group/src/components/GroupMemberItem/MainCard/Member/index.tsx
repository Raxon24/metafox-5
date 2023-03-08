/**
 * @type: itemView
 * name: group_member.itemView.mainCard
 */

import { connectItemView } from '@metafox/framework';
import { default as actionCreators } from '../../../../actions/groupMemberItemActions';
import ItemView from './ItemView';

export default connectItemView(ItemView, actionCreators);
