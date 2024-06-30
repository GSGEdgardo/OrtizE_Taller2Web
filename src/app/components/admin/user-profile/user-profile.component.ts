import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { ClientService } from 'src/app/services/client.service';
import { Account } from 'src/app/models/account';
import { Client, Gender } from 'src/app/models/client';

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

  /**
   * @description Initializes the component, gets the current account and loads genders.
   */
  ngOnInit(): void {
    this.getCurrentAccount();
    this.loadGenders();
  }

  /**
   * @description Gets the current account and client details.
   */
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

  /**
   * @description Loads the gender options.
   */
  loadGenders(): void {
    this.clientService.getGenders().subscribe(genders => {
      this.genders = genders;
    });
  }

  /**
   * @description Submits the updated profile information.
   */
  onSubmit(): void {
    if (this.editProfileForm.valid && this.currentClient) {
      const updatedClient: Client = {
        ...this.currentClient,
        name: this.editProfileForm.value.name,
        birthday: this.editProfileForm.value.birthday,
        gender: { id: this.editProfileForm.value.gender, type: '' }
      };
      this.clientService.updateClient(updatedClient).subscribe({
        next: () => {
          alert('Perfil actualizado con éxito');
          this.getCurrentAccount();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
