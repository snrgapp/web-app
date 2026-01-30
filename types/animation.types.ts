export type AnimationStage = 'idle' | 'shuffling' | 'presenting'

export interface CardAnimationState {
  stage: AnimationStage
  selectedCardIndex: number | null
}
