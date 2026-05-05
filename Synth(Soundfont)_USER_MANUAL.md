# Vector Sample Workstation 사용자 매뉴얼

이 문서는 현재 웹앱을 실제로 조작하는 방법을 기준으로 작성한 상세 매뉴얼입니다. 화면에는 하드웨어 워크스테이션처럼 보이는 장식 요소도 포함되어 있으므로, 동작하는 컨트롤과 현재 표시용 컨트롤을 구분해서 설명합니다.

## 1. 시작하기

1. 웹앱을 엽니다.
   - 로컬 개발 서버: `http://127.0.0.1:5173/synthesizer/`
   - GitHub Pages: `https://kimyounggaur.github.io/synthesizer-soundfont-/`
2. 브라우저 정책 때문에 오디오는 첫 사용자 입력 뒤에 활성화됩니다.
   - 아무 건반을 클릭하거나 `TEST TONE` 버튼을 누르면 오디오 컨텍스트가 시작됩니다.
3. 소리가 나지 않으면 먼저 다음을 확인합니다.
   - `MASTER` 볼륨이 너무 낮지 않은지 확인합니다.
   - `PANIC`을 한 번 눌러 걸린 노트를 정리합니다.
   - `ENGINE MODE`가 원하는 모드인지 확인합니다.
   - 샘플 소리를 내려면 `SAMPLE ON` 또는 Sample Page의 `Layer`가 켜져 있어야 합니다.

## 2. 화면 구성

앱은 워크스테이션 신시사이저 형태로 구성되어 있습니다.

- 상단 하드웨어 스트립: 프로그램 정보, 엔진 모드, 레벨 미터, BPM, 보이스 수, 마스터 볼륨, 패닉 버튼을 제공합니다.
- 왼쪽 페이지 버튼: Program, Sample, Hybrid, Seq, Global, Utility, Browser, Exit 버튼으로 중앙 LCD 페이지를 전환합니다.
- 중앙 LCD 패널: 실제 편집과 프리셋 선택이 이루어지는 메인 화면입니다.
- 오른쪽 Parameter Rack: 마스터 볼륨, BPM, 보이스 수, 기본 벨로시티를 빠르게 조정합니다.
- 하단 Performance Strip: 옥타브, 벨로시티, 샘플 레이어, 엔진 모드, 테스트 톤, 패닉을 빠르게 조작합니다.
- 하단 Keyboard: 마우스 또는 컴퓨터 키보드로 연주합니다.

## 3. 공통 조작법

### 버튼

모든 주요 동작 버튼은 마우스로 클릭합니다. 활성 상태인 버튼은 불빛, 강조색, 텍스트 상태로 함께 표시됩니다.

### 노브

노브는 다음 방식으로 조작합니다.

- 위로 드래그: 값을 올립니다.
- 아래로 드래그: 값을 내립니다.
- `Shift`를 누른 채 드래그: 더 세밀하게 조정합니다.
- 노브에 포커스를 둔 뒤 `ArrowUp` 또는 `ArrowRight`: 값을 한 단계 올립니다.
- 노브에 포커스를 둔 뒤 `ArrowDown` 또는 `ArrowLeft`: 값을 한 단계 내립니다.
- 더블클릭: 해당 노브의 중간값으로 리셋합니다.
- 노브 아래의 숨겨진 range 입력도 접근성용으로 연결되어 있습니다.

### 드롭다운과 입력창

드롭다운은 파형, 필터 타입, 샘플 뱅크, 프리셋, 이펙트 타입처럼 정해진 목록에서 값을 고를 때 사용합니다. 검색창이나 JSON 입력창에 커서가 있을 때는 컴퓨터 키보드 연주 단축키가 작동하지 않습니다.

## 4. 상단 하드웨어 스트립

### 프로그램 정보 영역

현재 프로그램 이름, 뱅크, 엔진 모드, 카테고리, BPM, 보이스 수를 보여줍니다. Program Page에서 프리셋을 로드하거나 Sample Page에서 샘플 프리셋을 선택하면 이 정보가 갱신됩니다.

### TouchView Set List

중앙 작은 화면에는 현재 사용할 수 있는 프리셋 슬롯 일부가 표시됩니다.

1. 슬롯을 클릭합니다.
2. 해당 프리셋이 즉시 로드됩니다.
3. 신스 프리셋은 신스 엔진 상태를 바꾸고, 샘플 프리셋은 샘플 레이어와 엔진 모드를 함께 설정합니다.

### Engine Mode

상단의 `SYNTH`, `SAMPLE`, `HYBRID` 버튼은 실제로 동작합니다.

- `SYNTH`: 기본 신스 오실레이터 중심으로 소리 납니다.
- `SAMPLE`: 선택된 샘플 레이어 중심으로 소리 납니다.
- `HYBRID`: 신스와 샘플 레이어를 함께 사용하는 모드입니다.

### Level Meter

출력 레벨을 표시합니다.

- `RUNNING`: 현재 오디오 엔진이 돌아가는 상태입니다.
- `PEAK`, `RMS`: 출력 레벨을 시각적으로 보여줍니다.
- `TEST`: 테스트 톤을 재생합니다.

### BPM / Voices

상단 우측의 `BPM` 숫자 입력은 템포를 바꿉니다. `VOICES` 숫자 입력은 폴리포니 수를 바꿉니다.

### Master

상단 우측의 `MASTER` 노브는 마스터 볼륨입니다. 오른쪽 Parameter Rack의 Master 노브와 같은 값을 제어합니다.

### Panic

`PANIC` 버튼은 즉시 모든 활성 노트를 끄고, 테스트 톤 타이머도 정리합니다. 소리가 계속 울리거나 이상하게 겹칠 때 가장 먼저 누르는 안전 버튼입니다.

### 현재 표시용 컨트롤

상단 패널의 다음 요소는 현재 장식 또는 상태 표시용입니다.

- 물리 노브 1-6: Cutoff, Resonance, EG Int, EG Release, Effect, Reverb
- `LATCH`, `ARP`, `DRUM`, `AUDIO IN`, `MFX`, `TFX`
- 우측 엔코더 주변의 `-`, `+`, `EXIT`, `ENTER`
- Quick Access `MODE`, `PAGE`, `A-F`
- TouchView 하단의 `PLAY`, `MIXER`, `EQ`, `ARP/DRUM`, `TONE ADJ`

## 5. 왼쪽 페이지 버튼

왼쪽 세로 버튼은 중앙 LCD 페이지를 전환합니다.

- `PROGRAM`: 프리셋 목록, 검색, 저장, 가져오기, 내보내기
- `SAMPLE`: 샘플 뱅크와 샘플 프리셋 선택, 샘플 레이어 편집
- `HYBRID`: Synth Page로 연결되는 신스 편집 페이지
- `SEQ`: Wave/Vector Page로 연결되는 웨이브 시퀀서와 벡터 믹서 페이지
- `GLOBAL`: 글로벌 설정 페이지
- `UTILITY`: Effects Page로 연결되는 이펙트 편집 페이지
- `BROWSER`: Filter/Amp Page로 연결되는 필터와 엔벨로프 페이지
- `EXIT`: Modulation Page로 연결되는 LFO 편집 페이지

버튼 이름은 하드웨어 분위기를 위해 축약되어 있지만, 실제로는 각 편집 페이지를 전환하는 역할을 합니다.

## 6. 중앙 LCD 공통 요소

### Breadcrumb

LCD 상단에는 현재 위치를 알려주는 breadcrumb가 표시됩니다. 예를 들어 Program 화면에서는 현재 프로그램, 뱅크, 카테고리 흐름을 볼 수 있습니다. 이 영역은 안내용입니다.

### Page Tabs

LCD 내부의 상단 탭은 페이지 이름과 현재 위치를 보여줍니다. 페이지 전환은 주로 왼쪽 버튼 또는 워크스테이션 탭 버튼으로 수행합니다.

### Soft Keys F1-F6

LCD 하단의 `F1`부터 `F6`까지의 soft key는 현재 표시되어 있지만 기본적으로 비활성화되어 있습니다. 아직 기능이 연결되지 않은 버튼은 disabled 상태로 보입니다.

## 7. Program Page

Program Page는 신스 프리셋, 샘플 프리셋, 사용자 프리셋을 관리하는 메인 페이지입니다.

### Bank 선택

상단의 Bank 버튼으로 표시 대상을 바꿉니다.

- `BANK A: SYNTH`: 기본 신스 팩토리 프리셋
- `BANK B: SAMPLE`: 샘플 기반 팩토리 프리셋
- `BANK C: USER`: 사용자가 저장하거나 가져온 프리셋

### Category 필터

카테고리 버튼으로 목록을 좁힙니다.

- `ALL`
- `BASS`
- `LEAD`
- `PAD`
- `PIANO`
- `STRINGS`
- `DRUM`

### Search

검색창에 이름을 입력하면 프로그램 목록이 즉시 필터링됩니다. 검색창에 입력 중일 때는 컴퓨터 키보드 연주 단축키가 비활성화됩니다.

### 프로그램 로드

1. 목록에서 원하는 프리셋을 찾습니다.
2. 프리셋 행을 클릭하거나 상세 영역의 `LOAD PROGRAM`을 누릅니다.
3. 현재 엔진 상태가 해당 프리셋으로 바뀝니다.

### 프리셋 번호

프로그램 목록 왼쪽에는 `001`, `002`, `003`처럼 3자리 번호가 표시됩니다. 이 번호는 현재 필터링된 목록에서의 표시 순서입니다.

### 사용자 프리셋 저장

1. 원하는 소리를 편집합니다.
2. Program Page에서 `SAVE`를 누릅니다.
3. 브라우저 prompt에 프리셋 이름을 입력합니다.
4. 저장된 프리셋은 `BANK C: USER`에 나타납니다.

### Export

`EXPORT` 버튼을 누르면 현재 사용자 프리셋 데이터가 JSON 형태로 텍스트 영역에 표시됩니다. 브라우저가 허용하면 클립보드에도 복사됩니다.

### Import

1. JSON 텍스트 영역에 프리셋 JSON을 붙여넣습니다.
2. `IMPORT` 버튼을 누릅니다.
3. 유효한 사용자 프리셋이면 `BANK C: USER`에 추가됩니다.

JSON 형식이 잘못되면 가져오기에 실패합니다. 이때는 JSON 전체가 깨지지 않았는지, 중괄호와 대괄호가 맞는지 확인합니다.

### Delete

사용자 프리셋에는 삭제 버튼이 표시될 수 있습니다. 팩토리 프리셋은 삭제하지 않습니다.

## 8. Sample Page

Sample Page는 샘플 뱅크, 샘플 프리셋, 샘플 레이어 파라미터를 조작합니다.

### 샘플 뱅크 선택

Bank 드롭다운에서 사용할 샘플 뱅크를 선택합니다. 현재 기본 샘플 뱅크로 `Demo Lite`가 제공됩니다.

뱅크를 선택하면 UI가 manifest를 읽어 프리셋 목록을 표시합니다.

### 샘플 프리셋 선택

1. Bank를 선택합니다.
2. Category 또는 Search로 목록을 좁힙니다.
3. 원하는 샘플 프리셋을 클릭합니다.
4. 앱은 `selectSamplePreset(bankId, presetId)`를 실행합니다.
5. 엔진 모드는 자동으로 `SAMPLE`이 되고, 샘플 레이어가 켜집니다.

### 샘플 로딩 상태

샘플 선택 중에는 상태 메시지가 바뀔 수 있습니다.

- `LOADING SAMPLE`: 샘플 또는 manifest를 읽는 중입니다.
- `Preset ready`: 샘플 프리셋이 준비되었습니다.
- `Using fallback buffer`: 실제 샘플 파일 대신 대체 버퍼를 사용 중입니다.
- `READY`: 정상 대기 상태입니다.

### Layer

`Layer` 토글은 샘플 레이어를 켜거나 끕니다. `SAMPLE` 또는 `HYBRID` 모드에서 샘플 소리를 내려면 켜져 있어야 합니다.

### Preload

`PRELOAD`는 현재 선택한 샘플 프리셋을 미리 준비하도록 요청합니다. 샘플 프리셋을 고르지 않은 상태에서 누르면 먼저 샘플을 선택하라는 메시지가 표시됩니다.

### One Shot

`ONE SHOT`은 샘플을 한 번 재생하는 방식으로 사용할 때 켭니다. 드럼이나 효과음처럼 키를 떼도 짧게 끝까지 재생되는 느낌을 만들 때 사용합니다.

### Sample Level / Envelope

Sample Page의 노브는 샘플 레이어에 적용됩니다.

- `Level`: 샘플 레이어 볼륨
- `Attack`: 키를 누른 뒤 소리가 올라오는 시간
- `Decay`: Attack 뒤 Sustain까지 내려오는 시간
- `Sustain`: 누르고 있는 동안 유지되는 레벨
- `Release`: 키를 뗀 뒤 사라지는 시간

### Sample Filter

샘플 필터를 켜면 샘플 레이어에 필터가 적용됩니다.

- `Filter`: 필터 사용 여부
- `Cutoff`: 필터 컷오프 주파수
- `Res`: 필터 공진

### Sample Page의 Engine 버튼

Sample Page 내부에도 `SYNTH`, `SAMPLE`, `HYBRID` 버튼이 있습니다. 이 버튼들은 실제 엔진 모드를 변경합니다.

## 9. Synth Page

Synth Page는 오실레이터와 노이즈 소스를 편집하는 페이지입니다.

### OSC A

주 오실레이터 A입니다.

- `Waveform`: sine, square, sawtooth, triangle, pulse, wavetable 계열 파형 선택
- `Octave`: 옥타브 이동
- `Semi`: 반음 이동
- `Fine`: 미세 튜닝
- `Level`: OSC A 볼륨

### OSC B

두 번째 오실레이터입니다. OSC A와 같은 방식으로 파형, 옥타브, 반음, 미세 튜닝, 레벨을 조정합니다. OSC A와 다른 파형이나 튜닝을 주면 더 두꺼운 소리를 만들 수 있습니다.

### SUB

서브 오실레이터입니다.

- `On`: 서브 오실레이터 활성화
- `Waveform`: 서브 파형 선택
- `Octave`: 서브 오실레이터 위치
- `Level`: 서브 볼륨

### NOISE

노이즈 소스입니다.

- `On`: 노이즈 활성화
- `White/Pink`: 노이즈 색상 선택
- `Level`: 노이즈 볼륨

## 10. Filter/Amp Page

Filter/Amp Page는 필터와 엔벨로프를 편집합니다.

### Filter

- `Type`: 필터 타입 선택
- `Cutoff`: 밝기와 어두움을 결정하는 컷오프
- `Resonance`: 컷오프 주변 강조
- `Drive`: 필터 입력 또는 캐릭터 강도
- `Key Track`: 높은 음을 연주할수록 컷오프가 따라 올라가는 정도
- `Env Amount`: 필터 엔벨로프가 컷오프에 영향을 주는 정도

### Amp EG

전체 소리의 볼륨 변화를 설정합니다.

- `Attack`: 소리가 시작되는 시간
- `Decay`: Attack 뒤 Sustain까지 내려오는 시간
- `Sustain`: 키를 누르고 있는 동안 유지되는 볼륨
- `Release`: 키를 뗀 뒤 사라지는 시간

### Filter EG

필터 컷오프의 시간 변화를 설정합니다.

- `Attack`: 필터가 열리는 시간
- `Decay`: 필터가 Sustain 값으로 내려오는 시간
- `Sustain`: 유지되는 필터 위치
- `Release`: 키를 뗀 뒤 필터가 닫히는 시간

## 11. Modulation Page

Modulation Page는 LFO를 편집합니다.

### LFO 1 / LFO 2

각 LFO는 다음 요소를 가집니다.

- `Waveform`: LFO 파형 선택
- `Rate`: LFO 속도
- `Depth`: 모듈레이션 깊이
- `Target`: LFO가 영향을 줄 대상
- `Sync`: BPM에 맞춰 동기화할지 여부

활성 LFO는 LED 상태로 구분됩니다. Tempo Sync가 켜져 있으면 BPM 변화가 LFO 움직임에 영향을 줍니다.

## 12. Wave/Vector Page

Wave/Vector Page는 벡터 믹서와 웨이브 시퀀서를 함께 다룹니다.

### Vector Mixer

Vector Mixer는 X/Y 위치로 음색 균형을 바꿉니다.

- `X Mix`: 좌우 방향 믹스
- `Y Mix`: 상하 방향 믹스

벡터 위치를 바꾸면 여러 소스 사이의 균형을 움직이는 느낌을 만들 수 있습니다.

### Wave Sequencer

Wave Sequencer는 16단계 웨이브 움직임을 만듭니다.

- `Run`: 웨이브 시퀀서 켜기/끄기
- Step 버튼 1-16: 편집할 스텝 선택
- `Sync`: BPM 동기화
- `Skip`: 선택한 스텝 건너뛰기
- `Rev`: 선택한 스텝 역방향 처리
- `Wave`: 선택 스텝의 파형
- `Pitch`: 선택 스텝의 피치 오프셋
- `Level`: 선택 스텝의 레벨
- `Time`: 선택 스텝의 길이

## 13. Effects Page

Effects Page는 이펙트 체인을 관리합니다.

### 이펙트 추가

1. `Type` 드롭다운에서 이펙트 타입을 선택합니다.
2. `Add Effect`를 누릅니다.
3. 새 이펙트 슬롯이 체인에 추가됩니다.

사용 가능한 이펙트 타입은 다음과 같습니다.

- delay
- reverb
- distortion
- chorus
- flanger
- phaser
- compressor
- eq
- bitcrusher
- autoPan

### 이펙트 켜기/끄기

각 슬롯의 `On` 버튼으로 해당 이펙트만 활성화하거나 우회할 수 있습니다.

### 이펙트 삭제

각 슬롯의 `Del` 버튼을 누르면 해당 이펙트가 제거됩니다.

### Wet

모든 이펙트 슬롯에는 `Wet` 노브가 있습니다. 값이 높을수록 이펙트가 많이 섞입니다.

### 타입별 파라미터

이펙트 타입에 따라 추가 노브가 표시됩니다.

- Delay: Time, Feed
- Reverb: Decay
- Distortion: Drive
- Chorus: Time, Feed
- Flanger: Time, Feed
- Phaser: Freq, Q
- Compressor: Thresh, Ratio
- EQ: Freq, Q, Gain
- Bitcrusher: Drive
- AutoPan: Rate, Depth

## 14. Global Page

Global Page는 전체 시스템 설정과 안전 기능을 모아둔 페이지입니다.

- `Reset Synth`: 기본 신스 상태로 되돌립니다.
- `Panic`: 모든 노트를 즉시 정리합니다.

현재 Global Page는 MVP 범위로 구현되어 있으며, 일부 항목은 상태 표시 중심입니다.

## 15. 오른쪽 Parameter Rack

Parameter Rack은 어느 페이지에 있든 빠르게 조작할 수 있는 컨트롤입니다.

- `Master`: 마스터 볼륨
- `BPM`: 템포
- `Voices`: 폴리포니 수
- `Velocity`: 기본 연주 벨로시티
- `Test Tone`: 테스트 톤 재생
- `Panic`: 모든 노트 정리

## 16. 하단 Performance Strip

하단 Performance Strip은 연주 중 자주 쓰는 기능을 제공합니다.

- `OCT -`: 키보드 옥타브 내림
- `OCT +`: 키보드 옥타브 올림
- `VELOCITY`: 기본 벨로시티 조정
- `HOLD`: 현재는 버튼 상태만 토글되는 로컬 표시 기능입니다. 실제 서스테인 동작에는 연결되어 있지 않습니다.
- `SAMPLE ON`: 샘플 레이어 켜기/끄기
- `SYNTH`: 엔진 모드를 Synth로 변경
- `SAMPLE`: 엔진 모드를 Sample로 변경
- `HYBRID`: 엔진 모드를 Hybrid로 변경
- `TEST TONE`: 테스트 톤 재생
- `PANIC`: 모든 노트 정리

## 17. Keyboard 연주법

### 마우스 연주

하단 건반을 클릭하거나 누르고 있으면 소리가 납니다. 마우스를 떼면 noteOff가 실행됩니다.

### 컴퓨터 키보드 연주

컴퓨터 키보드로도 연주할 수 있습니다. 입력창, 드롭다운, 텍스트 영역에 포커스가 있을 때는 단축키가 비활성화됩니다.

지원되는 키는 다음과 같습니다.

- 숫자열: `` ` ``, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `0`, `-`, `=`
- Q열: `Q`, `W`, `E`, `R`, `T`, `Y`, `U`, `I`, `O`, `P`, `[`, `]`, `\`
- A열: `A`, `S`, `D`, `F`, `G`, `H`, `J`, `K`, `L`, `;`, `'`
- Z열: `Z`, `X`, `C`, `V`, `B`, `N`, `M`, `,`, `.`, `/`
- 숫자패드: `/`, `*`, `-`, `7`, `8`, `9`, `+`, `4`, `5`, `6`, `1`, `2`, `3`, `0`

### 옥타브 단축키

- `PageUp`: 키보드 옥타브 올림
- `PageDown`: 키보드 옥타브 내림

## 18. 자주 쓰는 작업 예시

### 신스 프리셋을 고르고 연주하기

1. 왼쪽에서 `PROGRAM`을 누릅니다.
2. `BANK A: SYNTH`를 선택합니다.
3. 카테고리나 검색으로 원하는 프리셋을 찾습니다.
4. 프리셋 행을 클릭합니다.
5. 하단 건반 또는 컴퓨터 키보드로 연주합니다.

### 샘플 피아노를 고르고 연주하기

1. 왼쪽에서 `SAMPLE`을 누릅니다.
2. Bank에서 `Demo Lite`를 선택합니다.
3. Piano 계열 샘플 프리셋을 선택합니다.
4. 엔진 모드가 `SAMPLE`로 바뀌었는지 확인합니다.
5. `Layer`가 켜져 있는지 확인합니다.
6. 건반을 눌러 연주합니다.

### 신스와 샘플을 함께 쓰기

1. Sample Page에서 샘플 프리셋을 선택합니다.
2. `HYBRID` 버튼을 누릅니다.
3. `SAMPLE ON` 또는 Sample Page의 `Layer`가 켜져 있는지 확인합니다.
4. Synth Page에서 OSC A/B를 조정합니다.
5. Sample Page에서 샘플 Level을 조절해 균형을 맞춥니다.

### 소리가 계속 울릴 때

1. `PANIC`을 누릅니다.
2. Master 볼륨을 확인합니다.
3. Effects Page에서 과도한 delay/reverb wet 값을 낮춥니다.
4. 다시 건반을 눌러 정상적으로 noteOn/noteOff가 되는지 확인합니다.

### 현재 소리를 사용자 프리셋으로 저장하기

1. 원하는 소리를 만듭니다.
2. Program Page로 이동합니다.
3. `SAVE`를 누릅니다.
4. 이름을 입력합니다.
5. `BANK C: USER`에서 저장된 프리셋을 확인합니다.

### 사용자 프리셋 백업하기

1. Program Page로 이동합니다.
2. `EXPORT`를 누릅니다.
3. JSON 텍스트 영역에 데이터가 표시되는지 확인합니다.
4. 필요하면 해당 JSON을 별도로 보관합니다.

### 사용자 프리셋 복원하기

1. Program Page의 JSON 텍스트 영역에 백업 JSON을 붙여넣습니다.
2. `IMPORT`를 누릅니다.
3. `BANK C: USER`에서 복원된 프리셋을 확인합니다.

## 19. 문제 해결

### 화면은 보이는데 소리가 나지 않음

- 브라우저가 오디오를 아직 시작하지 않았을 수 있습니다. `TEST TONE`을 누르거나 건반을 클릭합니다.
- `MASTER` 볼륨이 낮은지 확인합니다.
- `Voices`가 너무 낮거나 이상한 값인지 확인합니다.
- `PANIC`을 누른 뒤 다시 연주합니다.
- 샘플 소리라면 `Layer` 또는 `SAMPLE ON`이 켜져 있는지 확인합니다.

### 샘플이 원래 소리와 다르게 들림

- 상태 메시지가 `Using fallback buffer`라면 실제 샘플 파일 대신 대체 버퍼를 사용 중입니다.
- 샘플 파일 경로나 manifest가 올바르게 배포되었는지 확인해야 합니다.

### 프리셋 리스트가 길어서 잘림

- Program Page와 Sample Page의 목록 영역은 내부 스크롤을 사용합니다.
- 마우스 휠 또는 트랙패드로 목록 안쪽을 스크롤합니다.

### JSON Import가 실패함

- JSON 전체가 올바른 형식인지 확인합니다.
- 복사 중 앞뒤 문자가 빠지지 않았는지 확인합니다.
- 배열 또는 객체 구조가 깨지면 가져올 수 없습니다.

### GitHub Pages에서 예전 화면이 보임

- 브라우저 캐시가 남아 있을 수 있습니다.
- Windows 기준 `Ctrl + F5`로 강력 새로고침합니다.
- 배포된 주소가 `https://kimyounggaur.github.io/synthesizer-soundfont-/`인지 확인합니다.

### 모바일에서 탭이 많아 보임

- 탭과 페이지 버튼은 가로 스크롤 또는 반응형 레이아웃으로 표시됩니다.
- LCD 내부 목록은 패널 안에서 스크롤합니다.

## 20. 현재 구현 제한 사항

다음 요소는 현재 UI/UX 표현을 위한 표시용이거나 기능이 일부만 연결되어 있습니다.

- 상단 물리 노브 1-6은 실제 파라미터에 연결되어 있지 않습니다.
- `LATCH`, `ARP`, `DRUM`, `AUDIO IN`, `MFX`, `TFX`는 현재 표시용입니다.
- 우측 엔코더와 Quick Access 버튼은 현재 표시용입니다.
- LCD 하단 `F1-F6` soft key는 기본 비활성화 상태입니다.
- Performance Strip의 `HOLD`는 현재 로컬 상태 표시만 바뀌며 실제 sustain hold는 적용하지 않습니다.
- 일부 LCD 내부 서브탭은 현재 페이지 구조를 보여주는 표시용입니다.

## 21. 안전한 사용 팁

- 큰 볼륨으로 시작하지 말고 Master를 50-70% 근처에서 시작합니다.
- 새 이펙트를 여러 개 추가할 때는 Wet 값을 낮게 두고 하나씩 올립니다.
- Delay와 Reverb가 과하면 소리가 길게 남을 수 있으므로 `PANIC`으로 정리합니다.
- 샘플과 신스를 함께 쓰는 Hybrid 모드에서는 Sample Level과 OSC Level을 낮춰 클리핑을 피합니다.
- 실험 중 좋은 소리가 나오면 Program Page에서 바로 사용자 프리셋으로 저장합니다.
