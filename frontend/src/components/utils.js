export const calculateEffectiveStress = (inputs) => {
  const { doStress, feedStress, impurityStress, lightStress } = inputs;
  return doStress * 0.3 + feedStress * 0.2 + impurityStress * 0.35 + lightStress * 0.15;
};
