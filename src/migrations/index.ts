import * as migration_20251219_215102_initial from './20251219_215102_initial';
import * as migration_20251222_010523 from './20251222_010523';
import * as migration_20251222_030929 from './20251222_030929';
import * as migration_20251223_000107 from './20251223_000107';
import * as migration_20251223_010615 from './20251223_010615';
import * as migration_20251223_042541 from './20251223_042541';
import * as migration_20251223_052646 from './20251223_052646';
import * as migration_20251223_070442 from './20251223_070442';
import * as migration_20251223_193631_dotenv_config_path__env_production from './20251223_193631_dotenv_config_path__env_production';
import * as migration_20251223_202224_dotenv_config_path__env_production from './20251223_202224_dotenv_config_path__env_production';
import * as migration_20251223_205001_dotenv_config_path__env_production from './20251223_205001_dotenv_config_path__env_production';
import * as migration_20251227_183100 from './20251227_183100';

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
    name: '20251223_052646',
  },
  {
    up: migration_20251223_070442.up,
    down: migration_20251223_070442.down,
    name: '20251223_070442',
  },
  {
    up: migration_20251223_193631_dotenv_config_path__env_production.up,
    down: migration_20251223_193631_dotenv_config_path__env_production.down,
    name: '20251223_193631_dotenv_config_path__env_production',
  },
  {
    up: migration_20251223_202224_dotenv_config_path__env_production.up,
    down: migration_20251223_202224_dotenv_config_path__env_production.down,
    name: '20251223_202224_dotenv_config_path__env_production',
  },
  {
    up: migration_20251223_205001_dotenv_config_path__env_production.up,
    down: migration_20251223_205001_dotenv_config_path__env_production.down,
    name: '20251223_205001_dotenv_config_path__env_production',
  },
  {
    up: migration_20251227_183100.up,
    down: migration_20251227_183100.down,
    name: '20251227_183100'
  },
];
