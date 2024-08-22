import chalk from 'chalk';
import { getRand } from '../Util/Random.js';
import AchievementManager from '../Manager/AchievementManager.js';
import OptionManager from '../Manager/OptionManager.js';

const achvMgr = new AchievementManager();
const optMgr = new OptionManager();

class ActionHandler {
  constructor(player, monster) {
    this.player = player;
    this.monster = monster;

    this.critChance = optMgr.getOption('critChance');
    this.comboChance = optMgr.getOption('comboChance');
    this.defChance = optMgr.getOption('defChance');
    this.healChance = optMgr.getOption('healChance');
    this.runChance = optMgr.getOption('runChance');
  }

  attack() {
    let playerAttack = Math.ceil(getRand(this.player.attack()));

    if (Math.random() < this.critChance) {
      const finalDmg = Math.ceil(
        getRand((playerAttack + playerAttack * this.player.critMult) * (1 - this.monster.defMult)),
      );
      this.monster.hp -= finalDmg;
      achvMgr.onDealt(finalDmg);
      return chalk.green(`크리티컬! 플레이어가 몬스터에게 ${finalDmg} 피해를 입혔습니다.`);
    } else {
      this.monster.hp -= playerAttack;
      achvMgr.onDealt(playerAttack);
      return chalk.green(`플레이어가 몬스터에게 ${playerAttack} 피해를 입혔습니다.`);
    }
  }

  comboAttack() {
    if (Math.random() < this.comboChance) {
      let playerAttack = Math.ceil(getRand(this.player.attack()));
      if (Math.random() < this.critChance) {
        const comboAttack = Math.ceil(
          getRand((playerAttack + playerAttack * this.player.critMult) * 2) *
            (1 - this.monster.defMult),
        );
        this.monster.hp -= comboAttack;
        achvMgr.onDealt(comboAttack);
        return chalk.green(
          `크리티컬! 플레이어의 연속 공격이 성공하여 몬스터에게 ${comboAttack} 피해를 입혔습니다.`,
        );
      } else {
        const comboAttack = Math.ceil(getRand(playerAttack * 2));
        this.monster.hp -= comboAttack;
        achvMgr.onDealt(comboAttack);
        return chalk.green(
          `플레이어의 연속 공격이 성공하여 몬스터에게 ${comboAttack} 피해를 입혔습니다.`,
        );
      }
    } else {
      return chalk.red('연속 공격이 실패했습니다.');
    }
  }

  defend() {
    if (Math.random() < this.defChance) {
      const reducedDamage = Math.ceil(getRand(this.player.defend(this.monster.attack())));
      this.player.hp -= reducedDamage;
      return chalk.blue(
        `플레이어가 방어에 성공했습니다. ${Math.ceil(this.monster.attack())}의 공격을 ${reducedDamage}로 경감했습니다.`,
      );
    } else {
      const damage = Math.ceil(getRand(this.monster.attack()));
      this.player.hp -= damage;
      return chalk.red(`방어가 실패하여 ${damage}의 피해를 입었습니다.`);
    }
  }

  heal() {
    if (Math.random() < this.healChance) {
      const healedHp = Math.ceil(Math.min(this.player.maxHp, getRand(this.player.heal())));
      const amount = healedHp - this.player.hp;
      this.player.hp = healedHp;
      achvMgr.onHeal(amount);
      return chalk.blue(`플레이어가 ${amount}만큼 회복에 성공했습니다. `);
    } else {
      return chalk.red(`회복에 실패했습니다.`);
    }
  }

  runThrough() {
    if (Math.random() < this.runChance) {
      return { success: true, message: chalk.yellow('플레이어가 성공적으로 도망쳤습니다.') };
    } else {
      return { success: false, message: chalk.red('도망치기 실패했습니다.') };
    }
  }
}

export default ActionHandler;
