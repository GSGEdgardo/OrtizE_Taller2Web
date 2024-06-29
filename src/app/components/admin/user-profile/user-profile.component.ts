import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account';
import { Gender, Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  currentAccount: Account | null = null;
  currentClient: Client | null = null;
  genders: Gender[] = [];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private clientService: ClientService
  ) {
    this.editProfileForm = this.fb.group({
      name: [''],
      birthday: [''],
      gender: ['']
    });
  }

  ngOnInit(): void {
    this.getCurrentAccount();
    this.loadGenders();
  }

  getCurrentAccount(): void {
    this.accountService.currentAccount$.subscribe(account => {
      this.currentAccount = account;
      if (account) {
        this.clientService.getClients().subscribe(clients => {
          this.currentClient = clients.find(client => client.id === account.id) || null;
          if (this.currentClient) {
            this.editProfileForm.patchValue({
              name: this.currentClient.name,
              birthday: this.currentClient.birthday,
              gender: this.currentClient.gender.id
            });
          }
        });
      }
    });
  }

  loadGenders(): void {
    this.clientService.getGenders().subscribe(genders => {
      this.genders = genders;
    });
  }

  onSubmit(): void {
    if (this.editProfileForm.valid && this.currentClient) {
      const updatedClient: Client = {
        ...this.currentClient,
        name: this.editProfileForm.value.name,
        birthday: this.editProfileForm.value.birthday,
        gender: { id: this.editProfileForm.value.gender, type: '' }  // El `type` es opcional aquí ya que solo necesitas el `id`
      };
      this.clientService.updateClient(updatedClient).subscribe({
        next: () => alert('Perfil actualizado con éxito'),
        error: (err) => console.error(err)
      });
    }
  }
}
