import { h, VNode } from 'vue';
import { NAvatar, NSpace } from 'naive-ui';
import { handGuestureSampleImageLink } from '@/api/handguesture/sampleImage';

export const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 60,
    align: 'right'
  },
  {
    title: 'Label',
    key: 'name',
    edit: true,
  },
  {
    title: 'Items Count',
    key: 'items_count',
    width: 120,
    align: 'right'
  },
  {
    title: 'Samples',
    key: 'samples',
    render(row: Recordable) {
      const total = row.items_count || 0
      const max = total > 5 ? 5 : total
      let cache: Map<number, boolean> = new Map();
      let avatars: Array<VNode> = [];
      let i = 0;
      for (; i < max;) {
        const idx = Math.floor(Math.random() * total);
        if (cache.has(idx)) {
          continue
        }
        cache.set(idx, true)
        const link = handGuestureSampleImageLink(row.id, idx)
        const avatar = h(NAvatar, {
          size: 42,
          src: link,
        })
        avatars.push(avatar)
        i++;
      }
      return h(NSpace, {
        align: 'flex-end'
      }, {
        default: () => {
          return avatars
        }
      })
    }
  }
];
