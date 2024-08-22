import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { battle } from './Action/Battle.js';
import { getRand } from './Util/Random.js';
import AchievementManager from './Manager/AchievementManager.js';

const MAX_STAGE = 10;

class Entity {
  constructor() {
    // Attr
    this.hp = 100;
    this.maxHp = 100;
    this.atk = 10;
    this.def = 3;

    // Mult
    this.atkMult = 0.15;
    this.defMult = 0.15;
    this.critMult = 1.3;
    this.healMult = 0.4;
    this.maxHpMult = 0.3;
  }

  attack() {
    return this.atk + this.atk * this.atkMult;
  }
}

class Player extends Entity {
  constructor(stage) {
    super();
    this.hp = this.maxHp;
    this.maxHp = 100 + stage * 20;
    this.atk += Math.ceil(this.atk * this.atkMult);
    this.atkMult = 0.3;
    this.healMult = 0.2 + stage * 0.02;
  }

  defend(damage) {
    const reducedDamage = damage * this.defMult;
    return reducedDamage;
  }

  heal() {
    return Math.min(this.maxHp, this.hp + Math.ceil(this.maxHp * this.healMult));
  }
}

class Monster extends Entity {
  constructor(stage) {
    super();
    this.hp = this.maxHp;
    this.maxHp = 80 + stage * 20;
    this.atk += this.atk * this.atkMult;
    this.defMult = 0.25;
  }
}

function scaleEntity(entity, entityType) {
  const atkInc = Math.ceil(getRand(entity.atk * entity.atkMult));
  const defInc = Math.ceil(getRand(entity.def * entity.defMult));
  const maxHpInc = Math.ceil(getRand(entity.maxHp * entity.maxHpMult));

  entity.atk += atkInc;
  entity.def += defInc;
  entity.maxHp += maxHpInc;

  console.log(
    chalk.blueBright(
      `${entityType}의 공격력이 ${atkInc}, 방어력이 ${defInc}, 최대 HP가 ${maxHpInc} 증가했습니다.`,
    ),
  );
}

function scale(player, monster) {
  scaleEntity(player, '플레이어');
  scaleEntity(monster, '몬스터');
}

function delay() {
  readlineSync.question();
}

export async function startGame() {
  console.clear();
  let stage = 1;
  const player = new Player(stage);
  const monster = new Monster(stage);

  while (stage <= MAX_STAGE) {
    monster.hp = monster.maxHp;
    await battle(stage, player, monster);

    player.hp = player.heal();
    console.log(chalk.blueBright(`플레이어가 회복하여 HP가 ${player.hp}로 증가했습니다.`));

    // 스탯 스케일링
    scale(player, monster);

    console.log(chalk.yellowBright(`엔터를 눌러 다음 스테이지로 넘어갑니다.`));
    delay();

    stage++;
  }

  const achvMgr = new AchievementManager();
  achvMgr.onCompleted();
}