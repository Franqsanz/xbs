import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useInfiniteQuery,
  QueryClient,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import {
  getAllBooks,
  getAllSearchBooks,
  getAllFilterOptions,
  getBooksPaginate,
  getBook,
  getBooksFilter,
  getMoreBooks,
  getRelatedBooks,
  getMoreBooksAuthors,
  postBook,
  postRegister,
  getUserAndBooks,
  updateBook,
  deleteBook,
} from '@services/api';
import { logOut } from '@services/firebase/auth';
import { keys } from '@utils/utils';
import { BookType } from '@components/types';

const queryClient = new QueryClient();

function useMutatePost() {
  return useMutation({
    mutationKey: [keys.postBook],
    mutationFn: postBook,
    // Mutación optimista
    onMutate: async (newPost) => {
      // Cancelar consultas pendientes para la misma clave de consulta
      await queryClient.cancelQueries({ queryKey: [keys.postBook] });

      // Obtener los datos de la consulta anterior
      const previousPost = await queryClient.getQueryData([keys.postBook]);

      // Actualizar los datos en caché con el nuevo post
      await queryClient.setQueryData(
        [keys.postBook],
        (oldData?: BookType[] | undefined) => {
          if (oldData === null) return [newPost];
          // oldData debe ser iterable por eso el (oldData || []).
          return [...(oldData || []), newPost];
        },
      );

      return { previousPost }; // <--- Contexto
    },
    onError: (err, variables, context) => {
      console.log(err);
      // Revertir los datos en caché si la mutación falla
      if (context?.previousPost !== null) {
        queryClient.setQueryData([keys.postBook], context?.previousPost);
      }
    },
    onSettled: async () => {
      // Invalidar la consulta en caché para que se refresque
      await queryClient.invalidateQueries({
        queryKey: [keys.postBook],
      });
    },
  });
}

function useAllBooks() {
  return useQuery({ queryKey: [keys.all], queryFn: getAllBooks });
}

function useAllSearchBooks(book: string) {
  return useQuery({
    queryKey: [keys.allSearch, book],
    queryFn: () => getAllSearchBooks(book),
    refetchOnWindowFocus: false,
    enabled: false,
  });
}

function useAllFilterOptions() {
  return useQuery({
    queryKey: [keys.filtersOptions],
    queryFn: getAllFilterOptions,
    refetchOnWindowFocus: false,
  });
}

function useBooksPaginate() {
  return useInfiniteQuery({
    queryKey: [keys.paginate],
    queryFn: ({ pageParam }) => getBooksPaginate(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.info.nextPage === null) return;

      return lastPage.info.nextPage;
    },
  });
}

function useFilter(query: string | undefined, param: string | undefined) {
  return useSuspenseQuery({
    queryKey: [keys.filter, query, param],
    queryFn: () => getBooksFilter(query, param),
    gcTime: 3000,
  });
}

function useMoreBooks() {
  return useSuspenseQuery({
    queryKey: [keys.random],
    queryFn: getMoreBooks,
    refetchOnWindowFocus: false,
    gcTime: 3000,
    staleTime: 50000,
  });
}

function useRelatedBooks(id: string | undefined) {
  return useSuspenseQuery({
    queryKey: [keys.relatedBooks, id],
    queryFn: () => getRelatedBooks(id),
    refetchOnWindowFocus: false,
    gcTime: 3000,
    staleTime: 50000,
  });
}

function useMoreBooksAuthors(id: string | undefined) {
  return useSuspenseQuery({
    queryKey: [keys.moreBooksAuthors, id],
    queryFn: () => getMoreBooksAuthors(id),
    refetchOnWindowFocus: false,
    gcTime: 3000,
    staleTime: 50000,
  });
}

function useBook(pathUrl: string | undefined) {
  return useSuspenseQuery({
    queryKey: [keys.one, pathUrl],
    queryFn: () => getBook(pathUrl),
    refetchOnWindowFocus: false,
    gcTime: 3000,
  });
}

// Usuarios

function useUserRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [keys.userRegister],
    mutationFn: (token: string) => postRegister(token),
    onSuccess: (data) => {
      if (data) {
        return navigate(`/profile/${data.info.user.uid}`, { replace: true });
      }
    },
    onError: async (error) => {
      console.error('Error en el servidor:', error);
      await logOut();
    },
  });
}

function useProfile(id: string | undefined, token: string | null) {
  return useSuspenseQuery({
    queryKey: [keys.profile, id],
    queryFn: () => getUserAndBooks(id, token),
    gcTime: 3000,
  });
}

function useDeleteBook() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [keys.deleteBook],
    mutationFn: (id: string | undefined) => deleteBook(id),
    onSuccess: (data) => {
      if (data) {
        // return navigate(`/profile/${data.info.user.uid}`, { replace: true });
        return navigate('/explore', { replace: true });
      }
    },
    onError: async (error) => {
      console.error('Error en el servidor:', error);
      await logOut();
    },
  });
}

function useUpdateBook(book: any) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [keys.updateBook],
    mutationFn: (id: string | undefined) => updateBook(id, book),
    onSuccess: (data) => {
      if (data) {
        // return navigate(`/profile/${data.info.user.uid}`, { replace: true });
        return navigate('/explore', { replace: true });
      }
    },
    onError: async (error) => {
      console.error('Error en el servidor:', error);
      await logOut();
    },
  });
}

export {
  useMutatePost,
  useAllFilterOptions,
  useAllBooks,
  useAllSearchBooks,
  useBooksPaginate,
  useBook,
  useFilter,
  useMoreBooks,
  useRelatedBooks,
  useMoreBooksAuthors,
  useUserRegister,
  useProfile,
  useUpdateBook,
  useDeleteBook,
};
