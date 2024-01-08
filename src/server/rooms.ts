import Room from '../common/types/dto/room';
import TicTacToe from '../common/types/tictactoe';

export const RoomList: Room[] = [];

export const Games = new Map<Room, TicTacToe>();
