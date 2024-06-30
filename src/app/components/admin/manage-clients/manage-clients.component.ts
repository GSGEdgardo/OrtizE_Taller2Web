import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { AccountService } from 'src/app/services/account.service';
import { Client } from 'src/app/models/client';
import { Account } from 'src/app/models/account';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-manage-clients',
  templateUrl: './manage-clients.component.html',
  styleUrls: ['./manage-clients.component.css']
})
export class ManageClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchForm: FormGroup;
  currentAccount: Account | null = null;
  currentClient: Client | null = null;
  confirmMessage: string = '';
  actionText: string = '';
  showConfirmModal: boolean = false;
  noResultsMessage: string = '';

  constructor(
    private clientService: ClientService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  /**
   * @description Initializes the component, loads clients and gets the current account.
   */
  ngOnInit(): void {
    this.loadClients();
    this.getCurrentAccount();

    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(300) // Adds a delay to avoid excessive calls
    ).subscribe(query => {
      this.searchClients(query);
    });
  }

  /**
   * @description Loads the clients from the server.
   */
  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * @description Gets the current account details.
   */
  getCurrentAccount(): void {
    this.accountService.currentAccount$.subscribe(account => {
      this.currentAccount = account;
    });
  }

  /**
   * @description Searches for clients based on the query.
   * @param query string The search query.
   */
  searchClients(query: string): void {
    query = query.toLowerCase();
    if (query) {
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.rut.toLowerCase().includes(query) ||
        client.birthday.toString().toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.gender.type.toLowerCase().includes(query)
      );
      this.noResultsMessage = this.filteredClients.length === 0 
        ? 'No se encuentra un cliente con ese nombre'
        : '';
    } else {
      this.filteredClients = this.clients;
      this.noResultsMessage = '';
    }
  }

  /**
   * @description Opens the confirmation modal to activate/deactivate a client.
   * @param client Client The client to be activated/deactivated.
   */
  openConfirmModal(client: Client): void {
    this.currentClient = client;
    this.actionText = client.isActive ? 'desactivar' : 'activar';
    this.showConfirmModal = true;
  }

  /**
   * @description Toggles the state (active/inactive) of the client.
   * @param client Client | null The client whose state is to be toggled.
   */
  toggleClientState(client: Client | null): void {
    if (!client) return;

    const newState = !client.isActive;
    this.clientService.changeClientState(client.id, newState).subscribe({
      next: () => {
        client.isActive = newState;
        this.showConfirmModal = false;
      },
      error: (err) => console.error(err)
    });
  }
}
