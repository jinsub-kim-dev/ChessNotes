# Chess Notes

Chess Notes는 체스 연습을 위한 웹 애플리케이션으로, 여러 체스 보드에서 포지션을 설정하고, 엔진의 제안과 비교하며 메모를 작성할 수 있습니다.
각 게임에 대해 3개의 체스 보드를 사용하며 주어진 포지션, 사용자가 둔 수, 체스 엔진이 제안한 수를 보드에 설정할 수 있습니다.

![sc](https://github.com/user-attachments/assets/0d744f4f-bdbb-4f4c-8807-c637ed8fc51d)

## Features
- **FEN 입력**: 포지션을 FEN(Forsyth-Edwards Notation) 형식으로 입력하여 설정할 수 있습니다.
- **Start position**: 게임의 모든 보드를 초기 상태로 설정할 수 있습니다.
- **Flip board**: 보드를 진영에 맞게 뒤집을 수 있습니다.
- **메모 기능**: 각 보드 하단에 포지션에 대한 메모를 작성할 수 있습니다.
- **데이터 저장 및 로드**: 게임 데이터를 JSON 파일 형식으로 저장하고 불러올 수 있습니다.


## 설치 및 실행

1. 저장소를 클론합니다.
   ```bash
   git clone https://github.com/jinsub-kim-dev/ChessNotes.git
   ```
2. 프로젝트 디렉터리로 이동
   ```bash
   cd ChessNotes
   ```
3. chess_notes.html 열기
