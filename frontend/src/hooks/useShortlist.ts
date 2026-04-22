import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api"; 

export function useShortlist() {
  const queryClient = useQueryClient();


  const { data: savedPlayerIds = [], isLoading } = useQuery({
    queryKey: ["shortlist"],
    queryFn: async () => {
      const res = await api.get("/shortlist");
      return res.data.map((item: any) => item.playerId) as number[];
    },
  });

  const toggleShortlist = useMutation({
    mutationFn: async (playerId: number) => {
      const res = await api.post(`/shortlist/toggle`, { playerId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlist"] });
    },
    onError: (error) => {
      console.error("Error al guardar en shortlist:", error);
      alert("Hubo un error al guardar el jugador. Mirá la consola.");
    }
  });

  return {
    savedPlayerIds,
    isLoading,
    toggleShortlist: toggleShortlist.mutate,
    isToggling: toggleShortlist.isPending,
  };
}