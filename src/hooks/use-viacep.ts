import { useState } from "react";
import { toast } from "sonner";

export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const useViaCep = () => {
  const [loading, setLoading] = useState(false);

  const fetchAddress = async (cep: string): Promise<ViaCepAddress | null> => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return null;

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return null;
      }

      return data as ViaCepAddress;
    } catch (error) {
      toast.error("Erro ao buscar CEP");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchAddress, loading };
};
