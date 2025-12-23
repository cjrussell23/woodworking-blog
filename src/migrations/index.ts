import * as migration_20251219_215102_initial from './20251219_215102_initial';
import * as migration_20251222_010523 from './20251222_010523';
import * as migration_20251222_030929 from './20251222_030929';
import * as migration_20251223_000107 from './20251223_000107';
import * as migration_20251223_010615 from './20251223_010615';
import * as migration_20251223_042541 from './20251223_042541';
import * as migration_20251223_052646 from './20251223_052646';

export const migrations = [
  {
    up: migration_20251219_215102_initial.up,
    down: migration_20251219_215102_initial.down,
    name: '20251219_215102_initial',
  },
  {
    up: migration_20251222_010523.up,
    down: migration_20251222_010523.down,
    name: '20251222_010523',
  },
  {
    up: migration_20251222_030929.up,
    down: migration_20251222_030929.down,
    name: '20251222_030929',
  },
  {
    up: migration_20251223_000107.up,
    down: migration_20251223_000107.down,
    name: '20251223_000107',
  },
  {
    up: migration_20251223_010615.up,
    down: migration_20251223_010615.down,
    name: '20251223_010615',
  },
  {
    up: migration_20251223_042541.up,
    down: migration_20251223_042541.down,
    name: '20251223_042541',
  },
  {
    up: migration_20251223_052646.up,
    down: migration_20251223_052646.down,
    name: '20251223_052646'
  },
];
