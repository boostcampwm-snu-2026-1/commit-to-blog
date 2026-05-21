import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  CreatePostRequest,
  ListPostsResponse,
  Post,
  PublishExternalRequest,
  PublishExternalResponse,
  UpdatePostRequest,
} from "@commit-to-blog/shared";
import {
  createPost,
  deletePost,
  getPost,
  listPosts,
  publishExternal,
  publishPost,
  updatePost,
  type ListPostsParams,
} from "../../api/posts.js";

const KEYS = {
  list: (params: ListPostsParams) =>
    [
      "posts",
      "list",
      params.status ?? "all",
      params.tag ?? "",
      params.q ?? "",
    ] as const,
  detail: (id: string) => ["posts", "detail", id] as const,
};

export function usePostsList(params: ListPostsParams = {}) {
  return useQuery<ListPostsResponse, Error>({
    queryKey: KEYS.list(params),
    queryFn: () => listPosts(params),
  });
}

export function usePostDetail(id: string | null) {
  return useQuery<{ post: Post }, Error>({
    queryKey: id ? KEYS.detail(id) : ["posts", "detail", "null"],
    queryFn: () => getPost(id!),
    enabled: Boolean(id),
  });
}

function useInvalidatePostsLists() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["posts", "list"] });
  };
}

export function useCreatePost() {
  const invalidate = useInvalidatePostsLists();
  return useMutation<{ post: Post }, Error, CreatePostRequest>({
    mutationFn: (body) => createPost(body),
    onSuccess: () => invalidate(),
  });
}

export function useUpdatePost(id: string | null) {
  const qc = useQueryClient();
  const invalidate = useInvalidatePostsLists();
  return useMutation<{ post: Post }, Error, UpdatePostRequest>({
    mutationFn: (patch) => updatePost(id!, patch),
    onSuccess: ({ post }) => {
      qc.setQueryData(KEYS.detail(post.id), { post });
      invalidate();
    },
  });
}

export function usePublishPost() {
  const qc = useQueryClient();
  const invalidate = useInvalidatePostsLists();
  return useMutation<{ post: Post }, Error, { id: string; publish: boolean }>({
    mutationFn: ({ id, publish }) => publishPost(id, publish),
    onSuccess: ({ post }) => {
      qc.setQueryData(KEYS.detail(post.id), { post });
      invalidate();
    },
  });
}

export function usePublishExternal() {
  const qc = useQueryClient();
  const invalidate = useInvalidatePostsLists();
  return useMutation<
    PublishExternalResponse,
    Error,
    { id: string; body?: PublishExternalRequest }
  >({
    mutationFn: ({ id, body }) => publishExternal(id, body),
    onSuccess: ({ post }) => {
      qc.setQueryData(KEYS.detail(post.id), { post });
      invalidate();
    },
  });
}

export function useDeletePost() {
  const invalidate = useInvalidatePostsLists();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => invalidate(),
  });
}
