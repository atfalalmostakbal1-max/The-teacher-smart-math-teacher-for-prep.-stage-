
export interface MathSolution {
  understanding: string;
  textSteps: string[];
  audioScript: string;
  whiteboardSteps: WhiteboardStep[];
  finalResult: string;
}

export interface WhiteboardStep {
  content: string;
  color: 'blue' | 'black' | 'green';
}

export enum InputMode {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  CAMERA = 'CAMERA'
}

export type Language = 'ar' | 'en';

export type TeacherStatus = 'ready' | 'thinking' | 'explaining_text' | 'explaining_board';
