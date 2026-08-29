import UserDetailsPage from './_components/UserDetailsPage'

export default async function Page(props: { params: Promise<{ locale: string; id: string }> }) {
  const params = await props.params

  return <UserDetailsPage userId={params.id} />
}
