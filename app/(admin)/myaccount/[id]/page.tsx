import { auth } from "@/auth";
import UpdateAccountComponent from "../_components/UpdateAccount";


const MyAccount = async () => {
  //const user = await auth()
  const user = 'SCHOOL'
  return (
    <div>
      <UpdateAccountComponent user={user} />
    </div>
  )
}

export default MyAccount