import { PLAYER } from './hooks/usePlayer';
import { STAGE } from './hooks/useStage';
import { STAGE_WIDTH, STAGE_HEIGHT } from './setup';
import { TETROMINOS } from './setup';

export const createStage = () => Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, 'clear']));

export const randomTetromino = () => {
  const tetrominos = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as (keyof typeof TETROMINOS)[];
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};
//플레이가능한 영역 지정
export const isColliding = (
  player: PLAYER,
  stage: STAGE,
  {x: moveX, y: moveY }: { x: number, y: number }
)=>{
  for(let y=0; y < player.tetromino.length; y++){
    for(let x=0; x < player.tetromino[y].length; x++){
      if (player.tetromino[y][x] !== 0){
        if(
          !stage[y + player.pos.y + moveY] ||
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX]||
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !=="clear"
        ){
          return true;
        }
      }
    }
  }
  return false;
}