import { useParams } from 'react-router-dom';

export default function EditPost() {
  const { id } = useParams();
  return (
    <section>
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <p className="text-sm text-gray-600">id: {id}</p>
    </section>
  );
}
