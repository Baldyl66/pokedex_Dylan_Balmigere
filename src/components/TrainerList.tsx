import type { Trainer } from '../types';
import './TrainerList.css';

interface TrainerListProps {
  trainers: Trainer[];
  activeTrainerId: number | null;
  onSelectTrainer: (id: number) => void;
}

export default function TrainerList({ trainers, activeTrainerId, onSelectTrainer }: TrainerListProps) {
  return (
    <div className="trainer-list">
      {trainers.length === 0 ? (
        <p className="no-trainers">Créez votre premier dresseur pour commencer</p>
      ) : (
        <div className="trainers-grid">
          {trainers.map(trainer => (
            <div
              key={trainer.id}
              className={`trainer-card ${trainer.id === activeTrainerId ? 'active' : ''}`}
              onClick={() => onSelectTrainer(trainer.id)}
            >
              <div className="trainer-card-content">
                <h3>{trainer.name}</h3>
                {trainer.id === activeTrainerId && (
                  <div className="selected-badge">
                    ✓ Sélectionné
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
