import type { Trainer } from '../types';
import TrainerForm from './TrainerForm';
import TrainerList from './TrainerList';

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
    <>
      <h1>Créer vos dresseurs</h1>
      
      {trainers.length < 2 && (
        <TrainerForm
          newName={newName}
          trainersCount={trainers.length}
          onNameChange={onNameChange}
          onSubmit={onAddTrainer}
        />
      )}

      <TrainerList
        trainers={trainers}
        activeTrainerId={activeTrainerId}
        onSelectTrainer={onSelectTrainer}
      />

      {activeTrainer && (
        <div>
          <h2>Pokémons de {activeTrainer.name}</h2>
        </div>
      )}
    </>
  );
}
