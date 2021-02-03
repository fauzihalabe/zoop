import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  step: number = 0;
  loading;
  codigo: string = null;
  cadastro = {
    tipo: null,
    nome: null,
    celular: null,
    senha: null,
    documento: null,
    email: null
  }

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  async initLoading() {
    this.loading = await this.loadingController.create({
      message: 'Carregando...',
    });
    await this.loading.present();
  }

  async endLoading() {
    await this.loading.dismiss();
  }

  rastrear() {
    this.initLoading();
    setTimeout(async () => {
      this.endLoading();
      this.alerta('Ops!', 'Objeto não encontrado.')
    }, 2000);
  }

  async alerta(titulo, mensagem) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['Ok']
    });

    await alert.present();
  }

  //Autenticar com credenciais
  login1() {
    if (this.cadastro.senha && this.cadastro.email) {
      this.initLoading();

      this.afAuth.signInWithEmailAndPassword(this.cadastro.email, this.cadastro.senha)
      .then(() => {
        this.endLoading();
        this.step = 2.1
      })
      .catch((e) => {
        this.endLoading();
        this.alerta('Ops!', 'Algo deu errado. Por favor, tente novamente.');
      })
    }
    else {
      this.alerta('Ops!', 'Por favor, preencha todos os campos antes de continuar.');
    }
  }

  login2(){
    this.alerta('Tudo certo!', 'Conta logada com sucesso');
  }

  cadastro1(tipo) {
    this.cadastro.tipo = tipo;
    this.step = 3.1;
  }

  cadastro2() {
    if (this.cadastro.nome && this.cadastro.email && this.cadastro.senha && this.cadastro.celular) {
      this.initLoading();
      setTimeout(async () => {
        this.endLoading();
        this.step = 3.2
      }, 2000);
    }
    else {
      this.alerta('Ops!', 'Por favor, preencha todos os campos antes de continuar.');
    }

  }

  cadastro3() {
    // if (this.cadastro.documento){
    this.initLoading();
    setTimeout(async () => {
      this.endLoading();
      this.step = 3.3
    }, 2000);
    // }
    // else {
    // this.alerta('Ops!', 'Por favor, preencha todos os campos antes de continuar.');
    // }

  }

  cadastro4() {
    if (this.cadastro.documento) {
      this.initLoading();
      this.afAuth.createUserWithEmailAndPassword(this.cadastro.email, this.cadastro.senha)
        .then((r) => {
          let uid = r.user.uid;
          this.afs.firestore.collection('users').doc(uid).set(this.cadastro)
            .then(() => {
              this.endLoading();
              this.alerta('Tudo certo!', 'Conta criada com sucesso');
            })
        })
    }
    else {
      this.alerta('Ops!', 'Por favor, preencha todos os campos antes de continuar.');
    }


  }


  ngOnInit() {

  }

}
