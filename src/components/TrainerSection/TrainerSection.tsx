import type { Trainer } from '../../types';
import TrainerForm from '../TrainerForm';
import TrainerList from '../TrainerList/TrainerList';
import './TrainerSection.css';

interface TrainerSectionProps {
  trainers: Trainer[];
  newName: string;
  activeTrainerId: number | null;
  onNameChange: (name: string) => void;
  onAddTrainer: () => void;
  onSelectTrainer: (id: number) => void;
}

export default function TrainerSection({
  trainers,
  newName,
  activeTrainerId,
  onNameChange,
  onAddTrainer,
  onSelectTrainer
}: TrainerSectionProps) {
  const activeTrainer = trainers.find(t => t.id === activeTrainerId);

  return (
    <section className="trainer-section">
      <div className="trainer-section-layout">
        <div className="trainer-form-wrapper">
          {trainers.length < 2 && (
            <div className="create-trainer-card">
              <h3>Créer un dresseur</h3>
              <TrainerForm
                newName={newName}
                trainersCount={trainers.length}
                onNameChange={onNameChange}
                onSubmit={onAddTrainer}
              />
            </div>
          )}
        </div>
      </div>

      {/* Vignette flottante des dresseurs à droite (seulement si < 2 dresseurs) */}
      {trainers.length > 0 && trainers.length < 2 && (
        <div className="trainer-floating-panel">
          <TrainerList
            trainers={trainers}
            activeTrainerId={activeTrainerId}
            onSelectTrainer={onSelectTrainer}
          />
        </div>
      )}

      {activeTrainer && (
        <div className="active-trainer-section">
          <h2>Pokémons de {activeTrainer.name}</h2>
        </div>
      )}
    </section>
  );
}
