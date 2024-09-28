import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinService } from "../../services/apiCabins"; // Ensure correct import

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: mutateDeleteCabin } = useMutation({
    mutationFn: (id) => deleteCabinService(id), // This calls the delete service
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, mutateDeleteCabin };
}
