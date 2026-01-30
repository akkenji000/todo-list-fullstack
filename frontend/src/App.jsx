import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  
  // 1. Estados para o formulário (input do usuário)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prioridade, setPrioridade] = useState('Baixa')

  // Busca tarefas do Backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
    }
  }

  // Carrega ao iniciar
  useEffect(() => {
    fetchTasks()
  }, [])

  // 2. Função para criar nova tarefa
  const adicionarTarefa = async (e) => {
    e.preventDefault() // Evita que a página recarregue

    try {
      await axios.post('http://localhost:8080/api/v1/tasks', {
        title: titulo,
        description: descricao,
        priority: prioridade,
        user: { 
          // ⚠️ IMPORTANTE: Cole o ID do seu usuário aqui!
          id: "69796bf8298bfe3ba7bff11c" 
        }
      })
      
      // Limpa o formulário e recarrega a lista
      setTitulo('')
      setDescricao('')
      alert('Tarefa criada com sucesso!')
      fetchTasks() 

    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      alert('Erro ao criar tarefa. O Backend está ligado?')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Minha Lista de Tarefas (Java Spring + MongoDB + React)</h1>

      {/* --- FORMULÁRIO DE CADASTRO --- */}
      <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Nova Tarefa</h2>
        <form onSubmit={adicionarTarefa} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <input 
            type="text" 
            placeholder="Título da tarefa" 
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
          />
          
          <input 
            type="text" 
            placeholder="Descrição" 
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
          />

          <select 
            value={prioridade} 
            onChange={(e) => setPrioridade(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>

          <button type="submit" style={{ padding: '10px', background: '#646cff', color: 'white', border: 'none', cursor: 'pointer' }}>
            Adicionar Tarefa
          </button>
        </form>
      </div>

      {/* --- LISTAGEM --- */}
      {tasks.length === 0 && <p>Nenhuma tarefa encontrada.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ 
            background: '#f4f4f4', 
            color: '#333',
            margin: '10px 0', 
            padding: '15px',
            borderRadius: '4px',
            borderLeft: task.priority === 'Alta' ? '5px solid red' : '5px solid #646cff'
          }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{task.title}</h3>
            <p style={{ margin: 0 }}>{task.description}</p>
            <small style={{ display: 'block', marginTop: '10px', fontWeight: 'bold' }}>
              Prioridade: {task.priority}
            </small>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App