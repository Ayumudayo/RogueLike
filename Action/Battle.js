import chalk from 'chalk';
import readlineSync from 'readline-sync';
import ActionHandler from './ActionHandler.js';

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(
        `| Player HP: ${player.hp}/${player.maxHp}, Attack: ${player.atk}, Defence:  ${player.def} `,
      ) +
      chalk.redBright(
        `| Monster HP: ${Math.ceil(monster.hp)}/${Math.ceil(monster.maxHp)}, Attack: ${Math.ceil(monster.atk)}, Defence:  ${Math.ceil(monster.def)} |`,
      ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

export const battle = async (stage, player, monster) => {
  let logs = [];
  let turn = 1;
  const actionHandler = new ActionHandler(player, monster);

  while (Math.ceil(actionHandler.player.hp) > 0 && Math.ceil(monster.hp) > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 연속 공격 (${Math.ceil(actionHandler.comboChance * 100)}%) 3. 방어한다 (${Math.ceil(actionHandler.defChance * 100)}%) 4. 회복한다 (${Math.ceil(actionHandler.defChance * 100)}%) 5. 도망친다 (${Math.ceil(actionHandler.runChance * 100)}%)`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    let actionLog = '';
    switch (choice) {
      case '1':
        actionLog = actionHandler.attack();
        break;
      case '2':
        actionLog = actionHandler.comboAttack();
        break;
      case '3':
        actionLog = actionHandler.defend();
        break;
      case '4':
        actionLog = actionHandler.heal();
        break;
      case '5':
        const runResult = actionHandler.runThrough();
        if (runResult.success) {
          console.log(runResult.message);
          return; // 도망치기 성공 시 전투 종료
        } else {
          actionLog = runResult.message;
        }
        break;
      default:
        actionLog = chalk.red('올바른 선택을 하세요.');
        logs.push(`[${turn}] ${actionLog}`);
        continue; // 잘못된 입력 처리
    }

    logs.push(`[${turn}] ${actionLog}`);

    if (monster.hp > 0) {
      if (choice !== '3') {
        const monsterAttack = Math.ceil(monster.attack());
        player.hp -= monsterAttack;
        logs.push(chalk.red(`[${turn}] 몬스터가 플레이어에게 ${monsterAttack} 피해를 입혔습니다.`));
      }
    } else {
      console.log(chalk.yellowBright(`몬스터를 물리쳤습니다!`));
      break;
    }

    turn++;
  }

  if (player.hp <= 0) {
    console.log(chalk.red('플레이어가 패배했습니다.'));
    process.exit(0); // 게임 종료
  }
};
