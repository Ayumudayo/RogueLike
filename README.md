# **RougeLike JS**

## **프로젝트 개요**
이 프로젝트는 간단한 텍스트 기반 로그라이크 게임입니다.

플레이어는 몬스터와 전투를 벌이면서, 매 단계마다 플레이어와 몬스터가 점점 더 강해집니다.

플레이어는 공격, 방어, 회복 등의 다양한 액션을 선택하며, 
게임이 끝날 때까지 생존하면 승리하며, 플레이어가 패배하면 게임이 종료됩니다.

## **기능**
- **액션:** 공격, 연속 공격, 방어, 회복, 도망 등의 액션을 선택할 수 있습니다.
- **스테이지:** 총 10개의 스테이지가 있으며, 스테이지를 클리어할 때마다 플레이어와 몬스터의 스탯이 강화됩니다.
- **업적 시스템:** 게임 플레이 중 특정 조건을 달성하면 다양한 업적을 획득할 수 있습니다.
- **옵션 설정:** 크리티컬 확률, 연속 공격 확률, 방어 확률 등 다양한 게임 옵션을 사용자 정의할 수 있습니다.

## **설치 방법**

1. **리포지토리 클론:**
   ```bash
   git clone https://github.com/Ayumudayo/RogueLike.git
   ```

2. **필요한 패키지 설치:**
   ```bash
   npm install
   ```

3. **게임 시작:**
   ```bash
   node server.js
   ```

## **플레이 방법**
게임이 시작되면, 플레이어는 1단계의 몬스터와 전투를 시작하게 됩니다. 플레이어는 다음과 같은 액션 중 하나를 선택할 수 있습니다:

- **공격:** 기본 공격을 수행하여 몬스터에게 피해를 줍니다.
- **연속 공격:** 연속 공격을 시도하며, 성공 시 몬스터에게 큰 피해를 줍니다.
- **방어:** 몬스터의 공격을 방어하여 피해를 줄입니다.
- **회복:** 체력을 회복합니다.
- **도망:** 도망을 시도합니다. 도망에 성공하면 스테이지가 종료됩니다.

## **업적**
플레이어는 특정 조건을 달성함으로써 업적을 획득할 수 있습니다.
업적은 적에게 가한 누적 피해, 회복한 누적 체력, 게임 클리어 등의 목표를 달성할 때마다 획득됩니다.

## **옵션 설정**
게임 시작 전 또는 게임 도중 옵션 메뉴를 통해 크리티컬 확률, 연속 공격 확률, 방어 확률, 회복 확률 등을 조정할 수 있습니다. 옵션은 `options.json` 파일에 저장되며, 필요 시 언제든지 변경할 수 있습니다.