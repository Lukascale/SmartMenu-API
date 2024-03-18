import { useEffect, useState } from 'react';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({
        nome: '',
        descricao: '',
        valor: '',
        imagem: null // Para armazenar a imagem que ser� enviada
    });
    const [showForm, setShowForm] = useState(false); // Estado para controlar a visibilidade do formul�rio

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch('https://localhost:7265/Cardapio');
            if (!response.ok) {
                throw new Error('Erro ao buscar itens do card�pio');
            }
            const data = await response.json();
            setMenuItems(data);
        } catch (error) {
            console.error('Erro ao buscar itens do card�pio:', error);
        }
    };

    const deleteMenuItem = async (id) => {
        try {
            const response = await fetch(`https://localhost:7265/Cardapio/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erro ao excluir item do card�pio');
            }
            // Atualiza a lista de itens do menu ap�s a exclus�o
            fetchMenuItems();
        } catch (error) {
            console.error('Erro ao excluir item do card�pio:', error);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'imagem') {
            setNewItem({
                ...newItem,
                imagem: e.target.files[0] // Armazena o arquivo de imagem
            });
        } else {
            setNewItem({
                ...newItem,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nome', newItem.nome);
            formData.append('descricao', newItem.descricao);
            formData.append('valor', newItem.valor);
            formData.append('imagem', newItem.imagem); // Adiciona o arquivo de imagem ao FormData

            const response = await fetch('https://localhost:7265/Cardapio', {
                method: 'POST',
                body: formData // Envia FormData em vez de JSON
            });
            if (!response.ok) {
                throw new Error('Erro ao adicionar novo item ao card�pio');
            }
            // Limpa os campos do novo item e atualiza a lista de itens do menu
            setNewItem({
                nome: '',
                descricao: '',
                valor: '',
                imagem: null // Limpa tamb�m o campo de imagem
            });
            fetchMenuItems();
            setShowForm(false); // Fecha o formul�rio ap�s o envio bem-sucedido
        } catch (error) {
            console.error('Erro ao adicionar novo item ao card�pio:', error);
        }
    };
    console.log('descri��o');

    let URL = 'https://localhost:7265/';
    return (
        <div className="container btn-group-sm" id="clientes">
            <h2>Menu</h2>
            <button className="row mt-4 btn btn-primary mb-3" onClick={() => setShowForm(true)}>Adicionar Novo Item</button>
            {showForm && ( 
                <form onSubmit={handleAddItem}>
                    <div className="mb-3">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <input type="text" className="form-control" id="nome" name="nome" value={newItem.nome} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descricao" className="form-label">Descri��o</label>
                        <input type="text" className="form-control" id="descricao" name="descricao" value={newItem.descricao} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="valor" className="form-label">Valor</label>
                        <input type="text" className="form-control" id="valor" name="valor" value={newItem.valor} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="imagem" className="form-label">Imagem</label>
                        <input type="file" className="form-control" id="imagem" name="imagem" onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </form>
            )}
            
                <div className="row mt-4">
                    {menuItems.map((menuItem) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={menuItem.cardapioId}>
                            <div className="card shadow" style={{ width: "15rem" }}>
                                <img src={`${URL}${menuItem.imagem}`} alt={menuItem.nome} width="350" height="350" className="card-img-bottom img-fluid" />
                                <div className="card-body">
                                    <h5 className="card-title">{menuItem.nome}</h5>
                                    <p className="card-text">{menuItem.descricao}</p>
                                    <p className="card-text">Pre�o: R$ {menuItem.valor}</p>
                                    <button className="btn btn-outline-danger btn-card" onClick={() => deleteMenuItem(menuItem.cardapioId)}>Excluir</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="btn  btn-lg btn-plus">+</button>
            </div>
    );
};

export default Menu;
