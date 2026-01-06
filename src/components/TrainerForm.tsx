interface TrainerFormProps {
  newName: string;
  trainersCount: number;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

export default function TrainerForm({ newName, trainersCount, onNameChange, onSubmit }: TrainerFormProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <input
        type="text"
        value={newName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Nom du dresseur"
      />
      <button type="submit">
        Créer dresseur {trainersCount + 1}
      </button>
    </form>
  );
}
