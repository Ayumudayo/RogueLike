import fs from 'fs';
import chalk from 'chalk';
import readlineSync from 'readline-sync';

// 기본 옵션 값 정의
const DEFAULT_OPTIONS = {
  critChance: 0.3,
  comboChance: 0.35,
  defChance: 0.55,
  healChance: 0.55,
  runChance: 0.05,
};

const OPTION_FILE = './options.json';

class OptionManager {
  constructor() {
    this.options = this.loadOptions();
  }

  // 옵션을 파일에서 로드
  loadOptions() {
    try {
      if (!fs.existsSync(OPTION_FILE)) {
        // 파일이 존재하지 않으면 기본값으로 파일 생성
        this.saveOptions(DEFAULT_OPTIONS);
        return { ...DEFAULT_OPTIONS };
      }
      const data = fs.readFileSync(OPTION_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('옵션 파일을 로드하는 중 오류 발생:', error);
      // 오류 발생 시 기본값 반환
      return { ...DEFAULT_OPTIONS };
    }
  }

  // 옵션을 파일에 저장
  saveOptions(options = this.options) {
    fs.writeFileSync(OPTION_FILE, JSON.stringify(options, null, 2), 'utf-8');
  }

  // 특정 옵션을 설정
  setOption(key, value) {
    this.options[key] = value;
    this.saveOptions();
  }

  // 옵션 가져오기
  getOption(key) {
    return this.options[key];
  }

  // 옵션을 표시하고 설정하는 함수
  showOption() {
    let logs = [];

    while (true) {
      console.clear();
      console.log(chalk.magentaBright('=== 옵션 설정 ===\n'));

      logs.forEach((log) => console.log(log));
      let tmpLog = '';

      const options = [
        { key: 'critChance', name: '크리티컬 확률' },
        { key: 'comboChance', name: '연속 공격 확률' },
        { key: 'defChance', name: '방어 확률' },
        { key: 'healChance', name: '회복 확률' },
        { key: 'runChance', name: '도망 확률' },
      ];

      options.forEach((option, index) => {
        console.log(
          chalk.blue(`${index + 1}.`) +
            chalk.white(` ${option.name} (현재: ${this.getOption(option.key)})`),
        );
      });

      console.log(chalk.blue(`${options.length + 1}.`) + chalk.white(' 돌아가기'));

      const choice = parseInt(readlineSync.question('옵션을 선택하세요: '), 10);

      if (choice >= 1 && choice <= options.length) {
        const selectedOption = options[choice - 1];
        const newValue = readlineSync.question(
          `새로운 ${selectedOption.name}을(를) 입력하세요 (0.0 ~ 1.0): `,
        );
        this.setOption(selectedOption.key, parseFloat(newValue));

        tmpLog = chalk.green(`옵션이 성공적으로 저장되었습니다.${'\n'}`);
        logs.push(tmpLog);
      } else if (choice === options.length + 1) {
        return; // 로비로 돌아가기
      } else {
        tmpLog = chalk.red(`올바른 선택을 하세요.${'\n'}`);
        logs.push(tmpLog);
        this.showOption(); // 잘못된 입력일 경우 다시 옵션 화면으로
      }
    }
  }
}

export default OptionManager;
