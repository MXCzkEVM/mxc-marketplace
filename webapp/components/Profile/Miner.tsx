import { useRouter } from "next/router";
import UserMinedNFTs from "../UserMinedNFTs";
import Container from "../Container/Container";

export default function Miner() {
  const router = useRouter()

  return (
    <div className="cardsection">
      <UserMinedNFTs user={router.query.address} />
    </div>
  )
}