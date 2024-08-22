import fs from 'fs';
import chalk from 'chalk';
import readlineSync from 'readline-sync';

// 기본 업적 값 정의
const DEFAULT_ACHIEVEMENTS = {
    '초급 전사': {
        name: '초급 전사',
        description: '적에게 입힌 데미지 1,000',
        goal: 1000,
        count: 0,
        date: null,
        completed: false
    },
    '초급 힐러': {
        name: '초급 힐러',
        description: '회복한 체력 1,000',
        goal: 1000,
        count: 0,
        date: null,
        completed: false
    },
    '첫 시작': {
        name: '첫 시작',
        description: '게임 1회 완료',
        goal: 1,
        count: 0,
        date: null,
        completed: false
    }
};

const ACHIEVEMENT_FILE = './achievements.json';

class AchievementManager {
    constructor() {
        // 싱글톤
        if (AchievementManager.instance) {
            return AchievementManager.instance;
        }

        this.achievements = this.loadAchievements();

        AchievementManager.instance = this;
    }

    // 업적을 파일에서 로드
    loadAchievements() {
        try {
            if (!fs.existsSync(ACHIEVEMENT_FILE)) {
                this.saveAchievements(DEFAULT_ACHIEVEMENTS);
                return { ...DEFAULT_ACHIEVEMENTS };
            }
            const data = fs.readFileSync(ACHIEVEMENT_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('업적 파일을 로드하는 중 오류 발생:', error);
            return { ...DEFAULT_ACHIEVEMENTS };
        }
    }

    // 업적을 파일에 저장
    saveAchievements(achievements = this.achievements) {
        fs.writeFileSync(ACHIEVEMENT_FILE, JSON.stringify(achievements, null, 2), 'utf-8');
    }

    // 특정 업적의 진행을 업데이트하고 달성 여부를 갱신
    checkAndIncrement(achievementName, increment = 1) {
        if (this.achievements[achievementName]) {
            this.achievements[achievementName].count += increment;
        } else {
            this.achievements[achievementName] = {
                count: increment,
                name: achievementName,
                goal: increment,
                date: new Date().toISOString(),
                completed: false
            };
        }

        if (this.achievements[achievementName].count >= this.achievements[achievementName].goal) {
            this.achievements[achievementName].date = new Date().toISOString();
            this.achievements[achievementName].completed = true;
        }

        this.saveAchievements();
    }

    // 특정 업적이 달성되었는지 확인
    isAchievementCompleted(achievementName) {
        const achievement = this.achievements[achievementName];
        return achievement ? achievement.completed : false;
    }

    // 모든 업적을 반환
    getAchievements() {
        return this.achievements;
    }

    // 업적 리스트를 표시하는 함수
    showAchievements() {
        console.clear();
        console.log(chalk.magentaBright('=== 업적 리스트 ===\n'));

        const achievements = this.getAchievements();

        if (Object.keys(achievements).length === 0) {
            console.log(chalk.yellow('아직 달성된 업적이 없습니다.'));
        } else {
            for (const key in achievements) {
                const achievement = achievements[key];
                const status = achievement.completed ? chalk.green('달성됨') : chalk.red('미달성');
                const progress = `${achievement.count}/${achievement.goal}`;

                console.log(chalk.blueBright(`${achievement.name}`));
                console.log(`\t설명: ${chalk.white(achievement.description)}`);
                console.log(`\t상태: ${status}`);
                console.log(`\t진행: ${progress}`);
                if (achievement.completed) {
                    console.log(`\t달성 날짜: ${achievement.date}`);
                }
                console.log();
            }
        }

        console.log(chalk.gray('\n엔터 키를 눌러 로비로 돌아가기.'));
        readlineSync.question(); // 사용자 입력 대기
    }

    // 이벤트
    onDealt(damage) {
        this.checkAndIncrement('초급 전사', damage);
    }

    onHeal(health) {
        this.checkAndIncrement('초급 힐러', health);
    }

    onCompleted() {
        this.checkAndIncrement('첫 시작', 1);
    }
}

export default AchievementManager;
