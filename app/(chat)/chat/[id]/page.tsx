import { Chat } from '@/components/chat/chat';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <>
      <Chat
        id={id}
      />
    </>
  );
}
