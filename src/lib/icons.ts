import sun from '@phosphor-icons/core/assets/regular/sun.svg?raw';
import moon from '@phosphor-icons/core/assets/regular/moon.svg?raw';
import copy from '@phosphor-icons/core/assets/regular/copy.svg?raw';
import check from '@phosphor-icons/core/assets/regular/check.svg?raw';
import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw';
import arrowUpRight from '@phosphor-icons/core/assets/regular/arrow-up-right.svg?raw';
import play from '@phosphor-icons/core/assets/regular/play.svg?raw';
import arrowsClockwise from '@phosphor-icons/core/assets/regular/arrows-clockwise.svg?raw';
import caretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw';
import flowArrow from '@phosphor-icons/core/assets/regular/flow-arrow.svg?raw';
import cursor from '@phosphor-icons/core/assets/regular/cursor.svg?raw';
import lightning from '@phosphor-icons/core/assets/regular/lightning.svg?raw';
import stack from '@phosphor-icons/core/assets/regular/stack.svg?raw';
import sparkle from '@phosphor-icons/core/assets/regular/sparkle.svg?raw';

export const icons = {
  sun,
  moon,
  copy,
  check,
  'arrow-right': arrowRight,
  'arrow-up-right': arrowUpRight,
  play,
  'arrows-clockwise': arrowsClockwise,
  'caret-right': caretRight,
  'flow-arrow': flowArrow,
  cursor,
  lightning,
  stack,
  sparkle,
} as const;

export type IconName = keyof typeof icons;
