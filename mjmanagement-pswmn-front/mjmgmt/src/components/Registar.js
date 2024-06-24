import { useRef, useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_REGEX=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;;
const REGISTER_URL = process.env.REGISTER_URL

const SuccessoModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
            <div className="text-green-500 mb-4"><FaCheckCircle size={70}/></div>
            <h2 className="text-3xl font-bold mb-4 text-center">Utilizador registado com sucesso</h2>
            <p className="text-xl text-center mb-4">Redirecionando para página de login...</p>
            <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-400 animate-spin fill-indigo-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
);

const Registar = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();


    const [nome, setNome] = useState('');
    const [nomeFocus, setNomeFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [passe, setPasse] = useState('');
    const [validPasse, setValidPasse] = useState(false);
    const [passeFocus, setPasseFocus] = useState(false);

    const [matchPasse, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    useEffect(() => {   
        userRef.current.focus();
    }, [])

    useEffect(() => {   
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {   
        const result = PWD_REGEX.test(passe);
        setValidPasse(result);
        const match = passe === matchPasse;
        setValidMatch(match);
    }, [passe, matchPasse])

    useEffect(() => {
        setErrMsg('');
    }, [nome, email, passe, matchPasse])


    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(passe);
        console.log('V1:', v1);
        console.log('V2:', v2);
        if (!v1 || !v2) {
            setErrMsg("Dados inválidos");
            return;
        }
        
        try {
            const response = await axios.post(REGISTER_URL, 
                JSON.stringify({ name: nome, email: email, pass: passe}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                    
                }
            );

            setSuccess(true);            
            setTimeout(() => {
                navigate('/login');
                setSuccess(false);
            }, 3000);
            
        } catch(err) {
            if(!err?.response) {
                setErrMsg('Servidor parou de responder.')
            } else if (err.response?.status === 409) {
                setErrMsg('Ja existe uma conta com este email.')
            } else {
                setErrMsg('Falha ao registar')
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="flex justify-center xs:h-screen sm:h-screen md:h-auto lg:h-auto h-screen">
            {success && (<SuccessoModal />)} 
            <section className="xs:w-full sm:w-full md:w-1/2 lg:w-1/3 w-full bg-gray-100 rounded-lg p-8 flex flex-col xs:mt-0 sm:mt-0 md:mt-10 lg:mt-10">

                <h2 className="text-xl text-gray-900 font-medium mb-5">Registar</h2>

                <form onSubmit={handleSubmit}>
                <div className="relative mb-4">
                        <label htmlFor="nome" className="leading-7 text-gray-600">
                            Nome
                        </label>
                        <input 
                            type="text"
                            id="nome"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setNome(e.target.value)}
                            required
                            onFocus={() => setNomeFocus(true)}
                            onBlur={() => setNomeFocus(false)}
                            value={nome}

                        />
  
                    </div>

                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-gray-600">
                            Email
                        </label>
                        <input 
                            type="email"
                            id="email"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            value={email}

                        />
  
                    </div>

                    <div className="relative mb-4">
                        <label htmlFor="password"  className="leading-7 text-gray-600">
                            Palavra-passe:
                        </label>
                        <input 
                            type="password"
                            id="password"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"
                            onChange={(e) => setPasse(e.target.value)}
                            required
                            aria-invalid={validPasse ? "false" : "true"}
                            onFocus={() => setPasseFocus(true)}
                            onBlur={() => setPasseFocus(false)}
                            value={passe}

                        />
                    </div>

                    <div className="relative mb-4">
                        <label htmlFor="confirm_pwd" className="leading-7 text-gray-600">
                            Confirmar palavra-passe:
                        </label>
                        <input 
                            type="password"
                            id="confirm_pwd"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                    </div>
                    <p ref={errRef} className={errMsg ? "errmsg text-red-500 mb-3 text-center" : "offscreen"} aria-live="assertlive">{errMsg}</p>
                    <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg w-full">
                        Registar
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-3 self-center">
                    Já possui conta? <Link to="/login" className="text-indigo-500 hover:text-indigo-600"> Login</Link>
                </p>
            </section>
        </div>

    )
}

export default Registar