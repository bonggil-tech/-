import React from 'react';
import { createStage, isColliding } from './gameHelpers';

//hooks
import { useInterval } from './hooks/useInterval';
import { usePlayer } from './hooks/usePlayer';
import { useStage } from './hooks/useStage';
import { useGameStatus } from './hooks/useGameStatue';

// 컴포넌트들
import Stage from './components/Stage/Stage';
import Display from './components/Display/Display';
import StartButton from './components/StartButton/StartButton';

// Styles
import { StyledTetrisWrapper, StyledTetris } from './App.styles';

const App: React.FC = () => {
  const [dropTime, setDroptime] = React.useState<null | number>(null);
  const [gameOver, setGameOver] = React.useState(true);

  const gameArea = React.useRef<HTMLDivElement>(null);

  const {player, updatePlayerPos, resetPlayer, playerRotate} = usePlayer();
  const {stage, setStage, rowsCleared } = useStage(player,resetPlayer);
  const {score, setScore, rows, setRows, level, setLevel}= useGameStatus(rowsCleared);

  const movePlayer = (dir: number ) => {
    if (!isColliding(player, stage, { x: dir, y:0})){
      updatePlayerPos({x: dir, y: 0, collided: false});
    }
  };
  // 키보드 땠을때 낙하속도 다시정상으로
  const keyUp = ({ keyCode }:{ keyCode: number}): void => {
    if(!gameOver){
      if (keyCode==(32)){
        setDroptime(1000 / level +200);
      }else if (keyCode==40){
        setDroptime(1000 / level +200);
      }
    }
  }

  const handleStartGame = (): void => {
    // 시작
    if (gameArea.current) gameArea.current.focus();
    // 초기화
    setStage(createStage());
    setDroptime(1000);
    resetPlayer();
    setScore(0);
    setLevel(1);
    setRows(0);
    setGameOver(false);
  }
  // 이동
  const move = ({keyCode, repeat }: {keyCode: number, repeat: boolean}): void => {
    if(!gameOver){
      if (keyCode === 37) {
        movePlayer(-1);
      }else if (keyCode === 39){
        movePlayer(1);
      }else if (keyCode ===40){
        if (repeat) return;
        setDroptime(30);
      }else if(keyCode === 38){
        playerRotate(stage);
      }else if(keyCode === 32){
        setDroptime(10);
      }
    }
  }
  //블록 떨어지게
  const drop = ():void =>{
    if(rows > level *10){
      setLevel(prev => prev + 1);
      setDroptime(1000 / level + 200);
    }
    if(!isColliding(player, stage, {x:0,y:1})){
      updatePlayerPos({ x: 0,y:1,collided:false});
    }else{
      if(player.pos.y < 1){
        console.log ("게임끝");
        setGameOver(true);
        setDroptime(null);
      }
      updatePlayerPos({x:0, y:0, collided: true});
    }
  };

  useInterval(()=>{
    drop();
  },dropTime);

  return (
    <StyledTetrisWrapper role='button' tabIndex={0} onKeyDown={move} onKeyUp={keyUp} ref={gameArea}>
      <StyledTetris>
        <div className="display">
          {gameOver ? (
            <>
              <Display gameOver={gameOver} text="게임오버ㅜ"/>
              <StartButton callback={handleStartGame} />
            </>
          ) : (
            <>
              <Display text={`점수: ${score} `} />
              <Display text={`없앤줄: ${rows}`} />
              <Display text={`레벨: ${level}`} />
            </>
          )}
        </div>
        <Stage stage={stage} />
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default App;
