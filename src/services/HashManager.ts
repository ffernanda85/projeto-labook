import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

export class HashManager {
    /* haseiando a senha para salvar no DB */
    public hash = async (plaintext: string): Promise<string> => {
        const rounds = Number(process.env.BCRYPT_COST)
        const salt = await bcrypt.genSalt(rounds)
        const hash = await bcrypt.hash(plaintext, salt)

        return hash
    }
    /* Verificando se a senha hasheadda confere com a plaintext inserida no login */
    public compare = async (plaintext: string, hash: string): Promise<boolean> => {
				// aqui não precisa do await porque o return já se comporta como um
        return bcrypt.compare(plaintext, hash)
    }
}