import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false) // Estado de carregamento
  const [filtro, setFiltro] = useState('todos') // 'todos', 'pendentes', 'concluidos'
  
  // Estados do formulário
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prioridade, setPrioridade] = useState('Baixa')

  // --- (READ) ---
  const fetchTasks = async () => {
    setLoading(true) // Começa a carregar
    try {
      // Adicionei um delay artificial de 500ms pra ver o efeito de loading (retirar depois)
      await new Promise(resolve => setTimeout(resolve, 500)) 
      
      const response = await axios.get('http://localhost:8080/api/v1/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error("Erro:", error)
      Swal.fire('Erro!', 'Não foi possível buscar as tarefas.', 'error')
    } finally {
      setLoading(false) // Termina de carregar
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // --- (CREATE) ---
  const adicionarTarefa = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8080/api/v1/tasks', {
        title: titulo,
        description: descricao,
        priority: prioridade,
        user: { id: "69796bf8298bfe3ba7bff11c" } // Seu ID
      })
      setTitulo('')
      setDescricao('')
      
      // Alerta de Sucesso discreto no canto (Toast)
      const Toast = Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true
      })
      Toast.fire({ icon: 'success', title: 'Tarefa criada!' })
      
      fetchTasks() 
    } catch (error) {
      Swal.fire('Erro', 'Falha ao criar tarefa', 'error')
    }
  }

  // --- (UPDATE) ---
  const toggleTarefa = async (task) => {
    try {
      await axios.patch(`http://localhost:8080/api/v1/tasks/${task.id}/completed`, {
        completed: !task.completed
      })
      fetchTasks()
    } catch (error) {
      console.error("Erro ao atualizar:", error)
    }
  }

  // --- (DELETE) com SweetAlert ---
  const deletarTarefa = (id) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/v1/tasks/${id}`)
          fetchTasks()
          Swal.fire('Deletado!', 'Sua tarefa foi removida.', 'success')
        } catch (error) {
          Swal.fire('Erro!', 'Ocorreu um erro ao deletar.', 'error')
        }
      }
    })
  }

  // --- LÓGICA DE FILTRO E ORDENAÇÃO ---
  const tarefasFiltradas = tasks.filter(task => {
    if (filtro === 'pendentes') return !task.completed
    if (filtro === 'concluidos') return task.completed
    return true // 'todos'
  }).sort((a, b) => {
    // Ordena: Alta > Média > Baixa
    const peso = { 'Alta': 3, 'Média': 2, 'Baixa': 1 }
    return peso[b.priority] - peso[a.priority]
  })

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#e0e0e0' }}>🚀 To-Do List</h1>

      {/* FORMULÁRIO */}
      <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '12px', marginBottom: '30px', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <h2 style={{marginTop: 0}}>Nova Tarefa</h2>
        <form onSubmit={adicionarTarefa} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" placeholder="O que precisa ser feito?" value={titulo} onChange={(e) => setTitulo(e.target.value)} required
            style={{ padding: '12px', borderRadius: '6px', border: 'none', fontSize: '16px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" placeholder="Descrição (opcional)" value={descricao} onChange={(e) => setDescricao(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '6px', border: 'none' }}
            />
            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
              <option value="Baixa">🟢 Baixa</option>
              <option value="Média">🟡 Média</option>
              <option value="Alta">🔴 Alta</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '12px', background: '#646cff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
            + Adicionar Tarefa
          </button>
        </form>
      </div>

      {/* BOTÕES DE FILTRO */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        {['todos', 'pendentes', 'concluidos'].map(f => (
          <button 
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: filtro === f ? '#646cff' : '#e0e0e0',
              color: filtro === f ? 'white' : '#333',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: 'bold'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* FEEDBACK DE LOADING */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          ⏳ Carregando tarefas...
        </div>
      )}

      {/* LISTA VAZIA */}
      {!loading && tarefasFiltradas.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888' }}>Nenhuma tarefa encontrada neste filtro.</p>
      )}

      {/* LISTA DE TAREFAS */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tarefasFiltradas.map(task => (
          <li key={task.id} style={{ 
            background: task.completed ? '#f0f0f0' : '#fff', 
            margin: '10px 0', 
            padding: '15px',
            borderRadius: '8px',
            borderLeft: task.priority === 'Alta' ? '6px solid #ff4444' : task.priority === 'Média' ? '6px solid #ffbb33' : '6px solid #00C851',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: task.completed ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="checkbox" 
                checked={task.completed || false} 
                onChange={() => toggleTarefa(task)}
                style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#646cff' }}
              />
              
              <div>
                <h3 style={{ 
                  margin: '0 0 5px 0', 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#888' : '#333'
                }}>
                  {task.title}
                </h3>
                {task.description && <p style={{ margin: 0, fontSize: '14px', color: '#666', wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{task.description}</p>}
                
                {/* Badge de Prioridade */}
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  background: '#eee', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  marginTop: '5px',
                  display: 'inline-block',
                  color: task.priority === 'Alta' ? '#d32f2f' : '#333'
                }}>
                  {task.priority}
                </span>
              </div>
            </div>

            <button 
              onClick={() => deletarTarefa(task.id)}
              style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
              onMouseOver={(e) => {e.target.style.background = '#ff4444'; e.target.style.color = 'white'}}
              onMouseOut={(e) => {e.target.style.background = 'transparent'; e.target.style.color = '#ff4444'}}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App