import type { Trainer } from '../types';

interface TrainerListProps {
  trainers: Trainer[];
  activeTrainerId: number | null;
  onSelectTrainer: (id: number) => void;
}

export default function TrainerList({ trainers, activeTrainerId, onSelectTrainer }: TrainerListProps) {
  return (
    <div>
      {trainers.map(trainer => (
        <div
          key={trainer.id}
          onClick={() => onSelectTrainer(trainer.id)}
          style={{ cursor: 'pointer' }}
        >
          <h3>{trainer.name}</h3>
          {trainer.id === activeTrainerId && <p>✓ Sélectionné</p>}
        </div>
      ))}
    </div>
  );
}
