const User = require('../models/User')

exports.findAll =  async (req, res) => {
    await sleep(3000)
    function sleep(ms){
        return new Promise( (resolve) =>{
            setTimeout(resolve,ms)
        })
    }    
    await User.findAll({
        attributes: ['id', 'name', 'email', 'gender'],
        order:[['id', 'ASC']]
    })
    .then( (users) =>{
        return res.json({
            erro: false,
            users
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhum Usuário encontrado!!!`
        })
    })


}

exports.findOne = async (req, res) =>  {
    const { id } = req.params;
    try {
        // await User.findAll({ where: {id: id}})
        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário encontrado!"
            })
        }
        res.status(200).json({
            erro:false,
            users
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
};

exports.create = async (req, res) => {
    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);
   
    await User.create(dados)
    .then( ()=>{
        /* enviar e-mail */
        // let to = dados.email;
        // let cc = '';
        // let subject = `Sua conta foi criada com sucesso!`;

        // let mailBody = userCreateMailTemplate({
        //     name: dados.name,
        //     email: dados.email,
        //     gender: dados.gender
        // })
        // sendMail(to, cc, subject , mailBody);
        /* ************* */

        return res.status(201).json({
            erro: false,
            mensagem: 'Usuário cadastrado com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuário não cadastrado... ${err}`
        })
    })
}

exports.update = async (req, res) => {
    const { id } = req.body;

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Usuário alterado com sucesso!'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não alterado ...${err}`
        })
    })
}

exports.delete = async (req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id}})
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Usuário deletado com sucesso!"
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Usuário não apagado...`
        });
    });
}

exports.login = async (req, res) => {

    // await sleep(3000)
    // function sleep(ms){
    //     return new Promise( (resolve) =>{
    //         setTimeout(resolve,ms)
    //     })
    // }


    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'gender', 'password'],
        where: {
            email: req.body.email
        }
    })
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem:"Erro: Email ou senha incorreta!!"
        })
    }
    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.json({
            erro: true,
            mensagem: "Erro: Email ou senha incorreta!!!"
        })
    }

    let token = jwt.sign({id: user.id}, process.env.SECRET, {
        expiresIn: 6000
    })

    return res.json({
        erro:false,
        mensagem: "Login realizado com sucesso!!!",
        token
    })
}

exports.senha = async (req, res) => {
    const {id, password } = req.body;
    var senhaCrypt = await bcrypt.hash(password, 8);

    await User.update({password: senhaCrypt }, {where: {id: id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Senha edita com sucesso!"
        }); 
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}... A senha não foi alterada!!!`
        })
    })
}

exports.validaToken = async (req, res) => {
    await User.findByPk(req.userId, { 
        attributes: ['id', 'name', 'email']
    }).then( (user) => {
        return res.status(200).json({
            erro: false,
            user
        });
    }).catch( () =>{
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário realizar o login!"
        })
    })
} 