// interface HomeProps {
//   count: number;
// }

import Image from "next/image";
import appImagePreview from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import userAvatarImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolsCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {

  const [ poolTitle, setPoolTitle ] = useState("");

  async function createPool(event: FormEvent){
    event.preventDefault();
    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert("Bolão criado com sucesso, o código do bolão foi copiado para área de transferência!")
      
      setPoolTitle("")

    } catch (error) {
      console.error(error);
      alert("Falha ao criar o bolão tente novamente!");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="Logo da NLW COPA" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarImg} alt="Foto de usuários que estão participando do bolão" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100"
            type="text"
            required 
            placeholder="Qual o nome do seu bolão ?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 items-center flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
          <div className="flex flex-col">
            <span className="font-bold text-2xl">+{props.guessesCount}</span>
            <span>Palpites enviados</span>
          </div>
          </div>
        </div>
      </main>

      <Image
        src={appImagePreview}
        alt="Imagem de dois celulares com o preview do app na versão mobile"
        quality={100}
      />
    </div>
  )
}

export const getStaticProps = async () => {
  const [ poolCountResponse, guessCountResponse, usersCountResponse ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolsCount: poolCountResponse.data.count,
      guessesCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count
    }
  }
}
