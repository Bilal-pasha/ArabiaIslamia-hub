
import { Button } from "@/components/Button/Button";

interface Modal {
    closeModal: ()=> void;
    handleFunction: (id: string) => void;
    id: string;
    name?: string
}
export function Modal({closeModal, handleFunction, id, name}:Modal) {
  return (
    <>
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p>{`Are you sure you want to delete ${name}?`}</p>
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleFunction(id)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
    </>
  );
}
